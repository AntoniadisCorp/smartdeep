import { Component, OnInit, ElementRef, ViewChild, Inject, ChangeDetectionStrategy } from '@angular/core';
import { Item, OptionEntry, BodyObj, LibrarySpace, BookShelf } from '../../../../interfaces';
import { SelectionModel } from '@angular/cdk/collections';
import { Router, ActivatedRoute } from '@angular/router';
import { SmartEngineService, Logger } from '../../../../services';
import { catchError, map, switchMap, debounceTime, distinctUntilChanged, tap, startWith, finalize } from 'rxjs/operators';
import { fromEvent, of, merge, Observable } from 'rxjs';
import { middlebar, config } from '../../../../variables';
import { openMatDialog, globalSort, uploadProgress, toResponseBody, EmptyObj, addObjAttr, saveByHttpwithProgress } from '../../../../routines';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { DeleteitemListDialogConfirm } from '../../../../views/smartengine/components';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
    selector: 'app-library-libraryspace',
    templateUrl: './libraryspace.component.html',
    styleUrls: ['./libraryspace.component.scss']
})
export class LibrarySpaceComponent implements OnInit {


    @ViewChild('search', { static: false }) search!: ElementRef;
    @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort!: MatSort;

    isLoadingResults: boolean = true
    toggleListValueByid: number

    displayedColumns: string[] = ['select', '_id',
        'whatnot', 'type', 'bookshelves', 'date_added', 'date_modified', 'status',
        'operations'];


    selection = new SelectionModel<Item>(true, []);
    protected isRateLimitReached: boolean = false;


    resultsLength: any;
    data: any;
    protected extraFilters: Array<{ [x: string]: any; }>;
    private apiUrl: { searchUrl: string, deleteUrl: (col: string, id: string | number) => string, deleteManyUrl: string };

    // private libSpace: any[];
    progressActionDataBar: number;
    private tableAction: boolean = false

    constructor(private router: Router,
        private route: ActivatedRoute,
        private httpService: SmartEngineService,
        private logger: Logger,
        private dialog: MatDialog) { }

    ngOnInit(): void {



        // init API URL for CRUD ACTIVITIES
        this.apiUrl = {
            searchUrl: `${config.apiUrl}${middlebar}task${middlebar}library${middlebar}space${middlebar}search`,
            deleteUrl: (col: string, id: string | number) => `${config.apiUrl}${middlebar}task${middlebar}del${middlebar}${col}${middlebar}${id}`,
            deleteManyUrl: '',
        }

        this.VarInitialization()
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

    // private Functions
    private VarInitialization(): void {

        const routeSnapId: string | null = this.route.snapshot.paramMap.get('id')

        this.extraFilters = []
        if (routeSnapId) { this.extraFilters.push({ 'categoryId': routeSnapId.trim().toLocaleLowerCase() }) }


    }


    // ------------------------ Οn Table Load ----------------------------
    // public functions
    loadPage() {
        // this.sort.sortables.forEach( (v,k) => console.log(v, k))

        return this.httpService.find(
            '',
            this.search.nativeElement.value.trim().toLowerCase(),
            this.sort.direction,
            this.paginator.pageIndex + 1,
            this.paginator.pageSize,
            'libraryspace',
            this.apiUrl.searchUrl,
            this.sort.active,
            JSON.stringify(this.extraFilters)
        );
    }


    // ------------------------ Table Row Acts ----------------------------
    onRowClicked(Row: { _id: string }) {
        console.log('Row clicked: ', Row)

        if (!this.tableAction)
            console.log(Row._id)// this.router.navigate(['/library/book/view', Row._id])
        else this.tableAction = false
    }

    addRow(): void {
        this.addBookcaseModal()
    }

    editRow(Row: LibrarySpace): void {

        this.tableAction = true
        const RowData: LibrarySpace = {
            _id: Row._id,
            whatnot: Row.whatnot,
            type: Row.type,
            bookshelves: Row.bookshelves,
            date_added: Row.date_added,
            date_modified: Row.date_modified,
            disabled: Row.disabled
        }


        this.addBookcaseModal(RowData)
    }

    deleteRow(Row: { _id: string, whatnot: string }): void {

        this.tableAction = true
        // console.log('Row.SKU: ', Row.SKU)


        let data = {
            title: `Διαγραφή Βιβλιοθήκης`,
            subtitle: `κωδικός ${Row.whatnot}`,
            image: {
                icon: '',
                color: 'alert',
                svg: 'bookshelfNo'
            },
            text: `Είστε σίγουροι ότι θέλετε να διαγραφή η βιβλιοθήκη;`,
            action: 'Διαγραφή',
            status: false
        },
            width = '400px';

        openMatDialog(this.dialog, data, DeleteitemListDialogConfirm, width)
            .afterClosed()
            .subscribe((result: any) => {
                console.log('The dialog was closed', result);

                if (result)
                    this.httpService.deleteOneTask(this.apiUrl.deleteUrl('libraryspace', Row._id))
                        .subscribe((res) => { console.log('deleteOneTask: ', res), this.clearSearch() })
            });
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
            ).subscribe(data => (this.data = data));
    }


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
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'
            } row ${row.name + 1}`;
    }

    private addBookcaseModal(editRowData?: LibrarySpace): void {
        let data = {

            title: `Προσθήκη Βιβλιοθήκης χώρου`,
            subtitle: ``, /* ${this.libraryName.value} */
            image: {
                icon: '',
                color: 'alert',
                svg: 'bookcase'
            },
            text: ``,
            body: editRowData ? editRowData : null,
            editable: false
        },
            width = '400px';

        openMatDialog(this.dialog, data, LibrarySpaceDialogComponent, width)
            .afterClosed()
            .subscribe((result: any) => {
                console.log('The dialog was closed', result);
                if (!result) return

                this.clearSearch()
                this.progressActionDataBar = 0
                // push bookcase to Library 'Space' Array
                // this.libSpace.push()

                // this.bookcaseName.setValue(result.bookcase.name /* replaceAll(result.bookcase.name, '/', '') */)
            });
    }
}



/**
 * Add Book Case Dialog Component
 */


@Component({
    selector: 'app-library-addbookcase-dialog',
    templateUrl: 'dialog/addbookcase-dialog.component.html',
    styles: [`
    
        .bookcase .mat-form-field {
            width: 100%;
        }

        p {
            text-align: center;
        }
    
    `],/* 
    changeDetection: ChangeDetectionStrategy.OnPush, */
})
export class LibrarySpaceDialogComponent {

    LibSpaceForm: FormGroup
    nameObservable!: Observable<any>

    visible = true;
    selectable = true;
    removable = true;
    addOnBlur = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];

    filteredShelves!: Observable<string[]>;
    shelves: BookShelf[] = [];
    allShelves: string[] = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'ς'];
    Libtypes: { id: number, value: string }[];

    @ViewChild('shelvesInput', { static: false }) shelvesInput!: ElementRef<HTMLInputElement>;
    @ViewChild('auto', { static: false }) matAutocomplete!: MatAutocomplete;

    progressActionDataBar!: number;

    constructor(
        public dialogRef: MatDialogRef<LibrarySpaceDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private httpService: SmartEngineService) {

        this.LibSpaceForm = this.formBuilder.group({
            // name: [''],
            whatnot: ['', [Validators.required, Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9]{1,5}')]],
            bookshelf: ['', [Validators.required, Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9]{1,5}')]],
            // bookshelfNo: ['', [Validators.required, Validators.pattern('[0-9]{1,10}')]],
            LibtypesCntr: ['', [Validators.required, Validators.pattern('[0-9]{1,10}')]],
            date_added: new FormControl(new Date()),
            date_modified: new FormControl(''),
            disabled: new FormControl(false, Validators.required),
        })


        // On Init Window set default Values
        this.Libtypes = [{ id: 0, value: 'Ράφια' }, { id: 1, value: 'Ερμάριο' }]
        if (this.LibtypesCntr) this.LibtypesCntr.setValue(0);

        // On Edit Window set editable Row Values
        if (this.data.body) {
            this.LibSpaceForm.patchValue({
                whatnot: this.data.body.whatnot && this.data.body.whatnot.length ? this.data.body.whatnot : '',
                LibtypesCntr: (this.data.body.type && this.data.body.type.length ? this.data.body.type : 0),
                date_added: (this.data.body.date_added && this.data.body.date_added.length ? this.data.body.date_added : ''),
                date_modified: (this.data.body.date_modified && this.data.body.date_modified.length ? this.data.body.date_modified : ''),
                disabled: (this.data.body.disabled !== null ? !this.data.body.disabled : false),
            })

            this.shelves.push(...this.data.body.bookshelves && this.data.body.bookshelves.length ? (this.data.body.bookshelves as BookShelf[]) : [])
        }



        /* this.nameObservable = this.LibSpaceForm.valueChanges.pipe(

            map(() => {
                this.name.setValue(
                    this.whatnot.value + (this.bookshelf.value && this.bookshelf.value.length > 0 ? '/' : '') +
                    this.bookshelf.value + (this.bookshelf.value && this.bookshelfNo.value.length > 0 ? '/' : '')
                    + this.bookshelfNo.value,
                    { emitEvent: false })

                return this.name.value
            })
        ) */

        if (this.bookshelf)
            this.filteredShelves = this.bookshelf.valueChanges.pipe(
                startWith(null),
                map((shelf: string | null) =>
                    shelf ? this._filter(shelf) : [] // this.allShelves.slice()
                )
            );
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {

        // Set URL
        const sUrl = config.apiUrl + middlebar + 'task' +
            middlebar + 'library' + middlebar + 'space' + middlebar + 'save'

        let result = {
            bookcase: {
                // name: this.name.value,
                _id: this.data.body ? this.data.body._id : null,
                whatnot: this.whatnot ? this.whatnot.value : '',
                type: this.LibtypesCntr ? this.LibtypesCntr.value : '',
                bookshelves: this.shelves,
                date_added: this.data.body && this.date_added ? new Date(this.date_added.value) : new Date(),
                date_modified: this.data.body ? new Date() : null,
                disabled: this.data.body && this.disabled ? !this.disabled.value : false,
                // bookshelfNo: this.bookshelfNo.value,
            },
            editable: this.data.body ? true : false,
        }

        let addspace: LibrarySpace = {

            whatnot: result.bookcase.whatnot,
            type: result.bookcase.type,
            bookshelves: result.bookcase.bookshelves,
            date_added: result.bookcase.date_added,
            date_modified: result.bookcase.date_modified || undefined,
            disabled: result.bookcase.disabled,
            status: 'active',
            recyclebin: false
        }

        // contain _id to run Mongo db method as update function
        if (result.editable) addObjAttr(addspace, '_id', result.bookcase._id)


        // console.log('addspace: ', addspace)
        let dialogObj: BodyObj = {
            col: 'libraryspace',
            data: addspace,
        }
        if (!result.editable) addObjAttr(dialogObj, 'uniqueId', [{ 'whatnot': addspace.whatnot }])



        // save data to DB
        saveByHttpwithProgress(this.httpService, dialogObj, sUrl, this.progressActionDataBar)
            .subscribe((res: OptionEntry) => {

                // Close Dialog Box
                if (res && res.code == 200) this.dialogRef.close(res.code)
                else {

                    console.error(res.error.status)
                }
                this.progressActionDataBar = 0

            }, (error: any) => {
                console.log(error)
                // this.progressActionDataBar = 0
            })

    }

    get name() {
        return this.LibSpaceForm.get('name')
    }
    get whatnot() {
        return this.LibSpaceForm.get('whatnot')
    }
    get bookshelf() {
        return this.LibSpaceForm.get('bookshelf')
    }
    get bookshelfNo() {
        return this.LibSpaceForm.get('bookshelfNo')
    }
    get LibtypesCntr() {
        return this.LibSpaceForm.get('LibtypesCntr')
    }

    get date_added() {
        return this.LibSpaceForm.get('date_added')
    }

    get date_modified() {
        return this.LibSpaceForm.get('date_modified')
    }

    get disabled() {
        return this.LibSpaceForm.get('disabled')
    }

    add(event: MatChipInputEvent): void {
        // Add fruit only when MatAutocomplete is not open
        // To make sure this does not conflict with OptionSelected Event
        if (!this.matAutocomplete.isOpen) {
            const input = event.input;
            const value = event.value;

            // Add our fruit
            if ((value || "").trim()) {
                this.shelves.push(this.getBookShelves(value.trim()));
            }

            // Reset the input value
            if (input) {
                input.value = "";
            }

            if (this.bookshelf) this.bookshelf.setValue(null);
        }
    }



    remove(shelf: string) {
        this.removeElement(this.shelves, this.getBookShelves(shelf))
        // pushh to AllShelves
        this.allShelves.push(shelf)
        globalSort(this.allShelves)
    }

    selected(event: MatAutocompleteSelectedEvent): void {

        this.shelves.push(this.getBookShelves(event.option.viewValue));
        // remove from allShelves
        this.removeElement(this.allShelves, event.option.viewValue)

        this.shelvesInput.nativeElement.value = "";
        if (this.bookshelf) this.bookshelf.setValue(null);
    }

    private removeElement(arr: string[] | BookShelf[], shelf: string | BookShelf): void {

        let shelves: any = arr;
        let index: number = 0;

        index = shelves.indexOf(shelf);

        if (typeof shelf === 'object') {
            index = shelves.findIndex((e: BookShelf) => e.name === shelf.name && e.used === shelf.used)
        }

        if (index >= 0) {
            shelves.splice(index, 1);
        }
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();

        return this.allShelves.filter(
            fruit => fruit.toLowerCase().indexOf(filterValue) === 0
        );
    }

    private getBookShelves(s: string): BookShelf {
        return { name: s, used: false }
    }

}