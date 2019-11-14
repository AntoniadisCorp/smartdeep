import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MENUBTN_ITEM, ACTIONBTN_ITEMS, ITEM_DATA, middlebar, config } from 'src/app/variables';
import { InventoryTableColumns, Item, IDropDownMenu, ItoggleListMenu } from 'src/app/interfaces';
import { MatButtonToggleGroup } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { customDataSource, SmartEngineService, Logger } from 'src/app/services';
import { Book } from 'src/app/classes';
import { fromEvent, pipe, merge, of } from 'rxjs';
import { distinctUntilChanged, tap, debounceTime, startWith, switchMap, map, catchError } from 'rxjs/operators';

@Component({
    selector: 'app-smartengine-itemlist',
    templateUrl: './itemlist.component.html',
    styleUrls: ['./itemlist.component.scss']
})
export class ItemListComponent implements OnInit, AfterViewInit {


    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @ViewChild('search', { static: false }) search: ElementRef;


    book: Book;

    // tslint:disable-next-line: ban-types
    toggleListValueByid: number;

    toggleListOptions: Array<ItoggleListMenu>;

    displayedColumns: string[] = ['select', '_id', 'avatar', 'name', 'bookcase']; // 'tags', 'distributors', 'fullfillmentSKU', 'onhand', 'status

    dataSource = new MatTableDataSource<Book>();
    // dataSource: customDataSource
    selection = new SelectionModel<Item>(true, []);
    btnCheckboxCol: InventoryTableColumns[];
    value: string;

    MenuTools: IDropDownMenu[];
    ActionBtn: IDropDownMenu[];
    private apiUrl:string ;
    isLoadingResults: boolean = true;
    isRateLimitReached: boolean = false;
    resultsLength: any;
    data: any;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private httpService: SmartEngineService,
        private logger: Logger) { }

    ngOnInit(): void {

        this.MenuTools = MENUBTN_ITEM;
        this.ActionBtn = ACTIONBTN_ITEMS;

        // setup table paginator
        this.dataSource.paginator = this.paginator;
        // setup table sorting
        this.dataSource.sort = this.sort;

        this.book = this.route.snapshot.data['collection'];

        this.apiUrl = `${config.apiUrl}${middlebar}task${middlebar}library${middlebar}book${middlebar}search`
        // this.dataSource = new customDataSource(this.httpService, this.logger);

        // this.dataSource.load('', '', 'asc', 1, 5);

        this.setListViewToggle();

        // setup btn columns menu that will be displayed
        this.btnCheckboxCol = []

        this.displayedColumns.forEach((v, i) => {
            if (v === 'select') { return; } // stop processing this iteration

            this.btnCheckboxCol.push({
                checked: v.length > 0 && (this.displayedColumns.includes(v)),
                tbcolumn: v
            });
        });
    }

    ngAfterViewInit(): void {
        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

        fromEvent(this.search.nativeElement, 'keyup')
            .pipe(
                debounceTime(150),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                    this.loadPage();
                })
            )
            .subscribe();
        // setup table paginator - sort
        merge(this.sort.sortChange, this.paginator.page)

            .pipe(
                startWith({}),
                switchMap(() => {
                    this.isLoadingResults = true;
                    return this.loadPage()
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
            .subscribe(data => this.data = data);
    }

    setListViewToggle(): void {

        this.toggleListOptions = [{
            id: 1,
            value: 'Item List',
            icon: 'list',
            uRL: 'searchit',
        }, {
            id: 2,
            value: 'Image List',
            icon: 'image',
            uRL: 'searchil',
        }];

        this.toggleListValueByid = 1;
    }

    selectionChanged(item): void {
        console.log('Selected value: ' + item.value);

        const iList: ItoggleListMenu =
            this.toggleListOptions.find((k: ItoggleListMenu) => k.id === item.value);

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

    onRowClicked(row) {
        console.log('Row clicked: ', row);
    }

    // Apply Filtering/search on Table
    applyFilter(filterValue: string) {
        // this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    // Toogle selectors
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = 0/* this.dataSource.data.length */;
        return numSelected === numRows;
    }

    // Toogle selectors
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            /* this.dataSource.data.forEach(row => this.selection.select(row)) */ ''
    }

    // Toogle selectors Labels
    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Item): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
    }

    loadPage() {
        return this.httpService.find(
            '',
            this.search.nativeElement.value,
            this.sort.direction,
            this.paginator.pageIndex + 1,
            this.paginator.pageSize, 'book', this.apiUrl);
    }
}
