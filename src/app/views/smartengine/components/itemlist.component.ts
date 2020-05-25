import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ElementRef,
  Inject,
  Renderer2,
  Input
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import {
  MENUBTN_ITEM,
  ACTIONBTN_ITEMS,
  ITEM_DATA,
  middlebar,
  config
} from '../../../variables';
import {
  InventoryTableColumns,
  Item,
  IDropDownMenu,
  ItoggleListMenu
} from '../../../interfaces';

import { Router, ActivatedRoute } from '@angular/router';
import { customDataSource, SmartEngineService, Logger } from '../../../services';
import { Book } from '../../../classes';
import { fromEvent, pipe, merge, of } from 'rxjs';
import {
  distinctUntilChanged,
  tap,
  debounceTime,
  startWith,
  switchMap,
  map,
  catchError
} from 'rxjs/operators';
import { openMatDialog } from '../../../routines';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-library-addbook-dialog',
  template: `
      <h1 mat-dialog-title>
        {{data.title}} <i [ngClass]="data.image.color + ' fa-lg fas fa-' + data.image.icon"></i>
      </h1>
      <p> <mat-chip-list><mat-chip style="height: unset;">{{data.subtitle}}</mat-chip></mat-chip-list></p>
      <div mat-dialog-content>
          <p>{{data.text}}</p>
      </div>
      <div mat-dialog-actions class="justify-content-center">
          <button mat-button (click)="onNoClick()">Ακύρωση</button>
          <button mat-button (click)="onDelete()" cdkFocusInitial>{{data.action}}</button>
      </div>
  `,
  styles: [`
          p, h1 {
            text-align: center;
          }
        `
  ]
})
export class DeleteitemListDialogConfirm implements AfterViewInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteitemListDialogConfirm>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public el: ElementRef, public renderer: Renderer2) { }

  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
    const document: HTMLElement = this.el.nativeElement;
    const elem_: HTMLCollectionOf<Element> = document.getElementsByClassName('mat-chip-list-wrapper');

    const slide = elem_[0] as HTMLElement;
    this.renderer.setStyle(slide, 'display', 'block');
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDelete(): void {

    this.dialogRef.close(true);
  }

}


@Component({
  selector: 'app-smartengine-itemlist',
  templateUrl: './itemlist.component.html',
  styleUrls: ['./itemlist.component.scss'],

})
export class ItemListComponent implements OnInit, AfterViewInit {

  @Input() viewstyle: any;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild('search', { static: false }) search: ElementRef;

  book: Book;

  progress: number = 0

  // tslint:disable-next-line: ban-types
  toggleListValueByid: number;

  toggleListOptions: Array<ItoggleListMenu>;

  displayedColumns: string[] = ['select', 'SKU',
    'avatar', 'name', 'bookcase', 'author',
    'publisher', 'year', 'pages', 'status',
    'operations'];

  /* 'dimensions', 
  'isbn10', 'isbn13', 'notes', */
  // 'tags', 'distributors', 'fullfillmentSKU', 'onhand', 'status

  dataSource = new MatTableDataSource<Book>();
  // dataSource: customDataSource
  selection = new SelectionModel<Item>(true, []);
  btnCheckboxCol: InventoryTableColumns[];
  value: string;

  MenuTools: IDropDownMenu[];
  ActionBtn: IDropDownMenu[];

  isLoadingResults = true;
  isRateLimitReached = false;
  resultsLength: any;
  data: any;

  private tableAction: boolean = false
  private apiUrl: { searchUrl: string, deleteUrl: (col: string, id: string | number) => string, deleteManyUrl: string };
  extraFilters: Array<{ [x: string]: any; }>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private httpService: SmartEngineService,
    private logger: Logger,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.MenuTools = MENUBTN_ITEM;
    this.ActionBtn = ACTIONBTN_ITEMS;

    // setup table paginator
    // this.dataSource.paginator = this.paginator;
    // setup table sorting
    // this.dataSource.sort = this.sort;

    // init API URL for CRUD ACTIVITIES
    this.apiUrl = {
      searchUrl: `${config.apiUrl}${middlebar}task${middlebar}library${middlebar}book${middlebar}search`,
      deleteUrl: (col: string, id: string | number) => `${config.apiUrl}${middlebar}task${middlebar}del${middlebar}${col}${middlebar}${id}`,
      deleteManyUrl: '',
    }


    // this.dataSource = new customDataSource(this.httpService, this.logger);

    // this.dataSource.load('', '', 'asc', 1, 5);

    this.setListViewToggle();
    this.VarInitialization()

    // setup btn columns menu that will be displayed
    this.btnCheckboxCol = [];

    this.displayedColumns.forEach((v, i) => {
      if (v === 'select') {
        return;
      } // stop processing this iteration

      this.btnCheckboxCol.push({
        checked: v.length > 0 && this.displayedColumns.includes(v),
        tbcolumn: v
      });
    });
  }


  private VarInitialization(): void {

    const routeSnapId: string = this.route.snapshot.paramMap.get('id')

    this.extraFilters = []
    if (routeSnapId) { this.extraFilters.push({ 'categoryId': routeSnapId.trim().toLocaleLowerCase() }) }


  }

  ngAfterViewInit(): void {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    fromEvent(this.search.nativeElement, 'keyup')
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
        }),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.loadPage();
        }),
        map((data: any) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.count;

          return data.result;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return of([]);
        })
      )
      .subscribe(data => (this.data = data));

    // setup table paginator - sort
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {

          this.isLoadingResults = true;
          return this.loadPage();
        }),
        map((data: any) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.count;

          return data.result;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return of([]);
        })
      )
      .subscribe(data => (this.data = data));

  }

  setListViewToggle(): void {
    this.toggleListOptions = [
      {
        id: 1,
        value: 'Item List',
        icon: 'list',
        uRL: 'searchit'
      },
      {
        id: 2,
        value: 'Image List',
        icon: 'image',
        uRL: 'searchil'
      }
    ];

    this.toggleListValueByid = 1;
  }

  selectionChanged(item: any): void {
    // console.log('Selected value: ' + item.value);

    const iList: ItoggleListMenu = this.toggleListOptions.find(
      (k: ItoggleListMenu) => k.id === item.value
    );

    this.router.navigate(['/smartengine', iList.uRL]);
    /* this.toggleListValueByid.forEach(i => console.log(`Included Item: ${i}`)); */
  }

  // Toggle Table Columns
  setTableColumns(item: InventoryTableColumns): void {
    const colindex = this.displayedColumns.indexOf(item.tbcolumn, 0);
    const colExistance = colindex > -1;

    console.log(colExistance, item.checked);
    if (item.checked && !colExistance) {
      this.displayedColumns.push(item.tbcolumn);
    } else if (!item.checked && colExistance) {
      this.displayedColumns.splice(colindex, 1);
    }
  }

  // ------------------------ Table Row Acts ----------------------------
  onRowClicked(Row: { _id }) {
    console.log('Row clicked: ', Row)

    if (!this.tableAction)
      this.router.navigate(['/library/book/view', Row._id])
    else this.tableAction = false
  }

  editRow(Row: { _id: string, SKU: number }): void {
    this.tableAction = true
    this.router.navigate(['/library/book/add', Row._id])
  }

  deleteRow(Row: { _id: string, SKU: number }): void {

    this.tableAction = true
    // console.log('Row.SKU: ', Row.SKU)


    let data = {
      title: `Διαγραφή Βιβλίου`,
      subtitle: `κωδικός ${Row.SKU}`,
      image: {
        icon: '',
        color: 'alert',
        svg: 'bookshelfNo'
      },
      text: `Είστε σίγουροι ότι θέλετε να διαγραφεί το βιβλίο;`,
      action: 'Διαγραφή',
      status: false
    },
      width = '400px';

    openMatDialog(this.dialog, data, DeleteitemListDialogConfirm, width)
      .afterClosed()
      .subscribe((result: any) => {
        console.log('The dialog was closed', result);

        if (result)
          this.httpService.deleteOneTask(this.apiUrl.deleteUrl('book', Row._id)).subscribe((res) => { console.log('deleteOneTask: ', res) });
      });
  }

  // Apply Filtering/search on Table
  /* applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  } */

  // Toogle selectors
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = 0 /* this.dataSource.data.length */;
    return numSelected === numRows;
  }

  // Toogle selectors
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {

    this.isAllSelected() ? this.selection.clear() : '';
    /* this.dataSource.data.forEach(row => this.selection.select(row)) */
  }

  // Toogle selectors Labels
  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Item): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${
      this.selection.isSelected(row) ? 'deselect' : 'select'
      } row ${row.name + 1}`;
  }

  loadPage() {
    // this.sort.sortables.forEach( (v,k) => console.log(v, k))

    return this.httpService.find(
      '',
      this.search.nativeElement.value.trim().toLowerCase(),
      this.sort.direction,
      this.paginator.pageIndex + 1,
      this.paginator.pageSize,
      'book',
      this.apiUrl.searchUrl,
      this.sort.active,
      JSON.stringify(this.extraFilters)
    );
  }

  clearSearch() {
    this.search.nativeElement.value = '';

    this.loadPage()
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.isLoadingResults = true;
        }),

        map((data: any) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.count;

          return data.result;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          // Catch if the GitHub API has reached its rate limit. Return empty data.
          this.isRateLimitReached = true;
          return of([]);
        })
      )
      .subscribe(data => (this.data = data));
  }
}
