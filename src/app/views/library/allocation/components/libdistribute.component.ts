import { Component, OnInit, ElementRef, ViewChild, Inject, ChangeDetectorRef, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { SmartEngineService, Logger } from '../../../../services'
import { middlebar, config } from '../../../../variables'
import { SelectionModel } from '@angular/cdk/collections'
import { Item, OptionEntry, BookCase, LibrarySpace, Category, BodyObj, ObjectId, BookShelf } from '../../../../interfaces'
import { debounceTime, distinctUntilChanged, tap, switchMap, map, catchError, startWith, finalize } from 'rxjs/operators'
import { fromEvent, of, merge, Observable } from 'rxjs'
import { openMatDialog, _filter, saveByHttpwithProgress, addObjAttr, uid, MongoId, uploadProgress, toResponseBody } from '../../../../routines'
import { LibrarySpaceDialogComponent } from '../../map/components'
import { DeleteitemListDialogConfirm } from '../../../../views/smartengine/components'
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { COMMA, ENTER } from '@angular/cdk/keycodes'
import { ObjectID } from 'bson'
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete'
import { MatChipInputEvent } from '@angular/material/chips'
import { MatPaginator } from '@angular/material/paginator'
import { MatSort } from '@angular/material/sort'
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog'
import { MatOption } from '@angular/material/core'

@Component({
    selector: 'app-library-libdistribute',
    templateUrl: 'libdistribute.component.html',
    styleUrls: ['libdistribute.component.scss']
})

export class LibDistributeComponent implements OnInit {


    @ViewChild('search', { static: false }) search: ElementRef
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator
    @ViewChild(MatSort, { static: false }) sort: MatSort

    displayedColumns: string[] = ['select', '_id', 'skuid',
        'name', 'whatnot', 'type', 'bookshelf', 'categoryCount',
        'bookCount', 'desc', 'disabled', 'date_added', 'date_modified',
        'operations']

    selection = new SelectionModel<Item>(true, [])

    resultsLength: any
    progressActionDataBar: number
    isLoadingResults = true
    protected isRateLimitReached = false
    data: any
    protected extraFilters: Array<{ [x: string]: any }>

    private tableAction = false
    private apiUrl: { searchUrl: string, deleteUrl: (col: string, id: string | number) => string, deleteManyUrl: string }


    constructor(/* private router: Router, */
        private route: ActivatedRoute,
        private httpService: SmartEngineService,
        private logger: Logger,
        private dialog: MatDialog) { }

    ngOnInit() {


        // init API URL for CRUD ACTIVITIES
        this.apiUrl = {
            searchUrl: `${config.apiUrl}${middlebar}task${middlebar}library${middlebar}space${middlebar}search`,
            deleteUrl: (col: string, id: string | number) => `${config.apiUrl}${middlebar}task${middlebar}library${middlebar}alloc${middlebar}del${middlebar}${col}${middlebar}${id}`,
            deleteManyUrl: '',
        }

        this.VarInitialization()
    }

    ngAfterViewInit(): void {
        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0))

        fromEvent(this.search.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0
                }),
                switchMap(() => {
                    this.isLoadingResults = true
                    return this.loadPage()
                }),
                map((data: any) => {
                    // Flip flag to show that loading has finished.
                    this.isLoadingResults = false
                    this.isRateLimitReached = false
                    this.resultsLength = data.count

                    return data.result
                }),
                catchError(() => {
                    this.isLoadingResults = false
                    // Catch if the GitHub API has reached its rate limit. Return empty data.
                    this.isRateLimitReached = true
                    return of([])
                })
            )
            .subscribe(data => (this.data = data))

        // setup table paginator - sort
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap(() => {

                    this.isLoadingResults = true
                    return this.loadPage()
                }),
                map((data: any) => {
                    // Flip flag to show that loading has finished.
                    this.isLoadingResults = false
                    this.isRateLimitReached = false
                    this.resultsLength = data.count

                    return data.result
                }),
                catchError(() => {
                    this.isLoadingResults = false
                    // Catch if the GitHub API has reached its rate limit. Return empty data.
                    this.isRateLimitReached = true
                    return of([])
                })
            )
            .subscribe(data => (this.data = data))
    }

    // private Functions
    //
    //
    //
    // ------------------------ Οn Table Init ----------------------------
    private VarInitialization(): void {

        const routeSnapId: string = this.route.snapshot.paramMap.get('id')
        this.extraFilters = []
    }


    private addBookDistributeModal(editRowData?: BookCase): void {

        // tslint:disable-next-line: one-variable-per-declaration
        const data = {

            title: `Προσθήκη Βιβλιοθέσης`,
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
            width = '400px'

        openMatDialog(this.dialog, data, BookCaseDialogComponent, width)
            .afterClosed()
            .subscribe((result: any) => {
                console.log('The dialog was closed', result)
                if (!result) { return }
                this.clearSearch()
                this.progressActionDataBar = 0
            })

    }

    /* ------------------------ On Clear Search Table ---------------------------- */
    clearSearch() {
        this.search.nativeElement.value = ''
        this.loadPage()
            .pipe(
                debounceTime(300),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0
                    this.isLoadingResults = true
                }),

                map((data: any) => {
                    // Flip flag to show that loading has finished.
                    this.isLoadingResults = false
                    this.isRateLimitReached = false
                    this.resultsLength = data.count

                    return data.result
                }),
                catchError(() => {
                    this.isLoadingResults = false
                    // Catch if the GitHub API has reached its rate limit. Return empty data.
                    this.isRateLimitReached = true
                    return of([])
                })
            ).subscribe(data => (this.data = data))
    }

    // protected Functions
    //
    //
    //
    /* ------------------------ Οn Table Load ---------------------------- */
    protected loadPage(): Observable<OptionEntry[]> {
        // this.sort.sortables.forEach( (v,k) => console.log(v, k))
        console.log(`Allocation distribute apiUrl: ${this.apiUrl.searchUrl}`)
        return this.httpService.find(
            '',
            this.search.nativeElement.value.trim().toLowerCase(),
            this.sort.direction,
            this.paginator.pageIndex + 1,
            this.paginator.pageSize,
            'bookcase',
            this.apiUrl.searchUrl,
            this.sort.active,
            JSON.stringify(this.extraFilters)
        )
    }

    /* ------------------------ Table Row Acts ---------------------------- */
    onRowClicked(Row: { _id: string }) {
        console.log('Row clicked: ', Row)

        if (!this.tableAction) {
            console.log(Row._id)
        }// this.router.navigate(['/library/book/view', Row._id])
        else { this.tableAction = false }
    }

    addRow(): void {
        this.addBookDistributeModal()
    }

    editRow(Row: BookCase): void {

        this.tableAction = true

        const RowData: BookCase = {
            _id: Row._id,
            name: Row.name,
            skuid: Row.skuid,
            whatnot: Row.whatnot,
            bookshelf: Row.bookshelf,
            type: Row.type,
            categories: Row.categories,
            desc: Row.desc,
            books: Row.books,
            date_added: Row.date_added,
            date_modified: Row.date_modified,
            disabled: Row.disabled
        }


        this.addBookDistributeModal(RowData)
    }

    deleteRow(Row: { _id: string, name: string, whatnot: string, bookshelf: string }): void {

        this.tableAction = true

        // tslint:disable-next-line: one-variable-per-declaration
        const data = {
            title: `Διαγραφή Bιβλιοθέσης`,
            subtitle: `Τίτλος ${Row.name}`,
            image: {
                icon: '',
                color: 'alert',
                svg: 'bookshelfNo'
            },
            text: `Είστε σίγουροι για την διαγραφή της βιβλιοθέσης;`,
            action: 'Διαγραφή',
            status: false
        },
            width = '400px'

        openMatDialog(this.dialog, data, DeleteitemListDialogConfirm, width)
            .afterClosed()
            .subscribe((result: any) => {
                console.log('The dialog was closed', result)

                if (result) {
                    this.httpService.saveTasks({
                        data: { whatnot: Row.whatnot, bookshelf: Row.bookshelf }, col: 'libraryspace'
                    },
                        this.apiUrl.deleteUrl('bookcase', Row._id))
                        .subscribe((res) => { console.log('deleteOneTask: ', res), this.clearSearch() })
                }
            })
    }

    // ------------------------ On Table Selections ----------------------------
    // Toogle selectors
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length
        const numRows = 0 /* this.dataSource.data.length */
        return numSelected === numRows
    }

    // Toogle selectors
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {

        this.isAllSelected() ? this.selection.clear() : ''
        /* this.dataSource.data.forEach(row => this.selection.select(row)) */
    }

    // Toogle selectors Labels
    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Item): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'
            } row ${row.name + 1}`
    }
}

interface ProgressLoader {
    isthemeProcessing: boolean
    isProcessing: boolean
    progressActionDataBar: number
}


@Component({
    selector: 'app-library-libdistribute-bookcase-dialog',
    templateUrl: 'dialog/bookcase-dialog.component.html',
    styles: [`

        .bookcase .mat-mdc-form-field {
            width: 100%;
        }

        p {
            text-align: center;
        }

    `]
})
export class BookCaseDialogComponent {

    BookCaseForm: FormGroup


    @ViewChild('autoChip', { static: false }) matCategoryAutocomplete: MatAutocomplete
    @ViewChild('categoryInput', { static: false }) categoryInput: ElementRef<HTMLInputElement>


    libSpace: Observable<LibrarySpace[]>
    filteredCategories: Observable<string[]>
    // nameObservable: Observable<any>

    private libSpaceSelected: LibrarySpace[]
    private categorySelected: Category[]
    private cindex: number
    private stateGroupSelected: boolean

    categories: { _id: string | ObjectID, name: string }[] = []
    bookshelves: BookShelf[] = []


    fontSize = '18px'
    visible = true
    selectable = true
    removable = true
    addOnBlur = true
    separatorKeysCodes: number[] = [ENTER, COMMA]

    progressAction: ProgressLoader

    constructor(
        public dialogRef: MatDialogRef<BookCaseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder,
        private httpService: SmartEngineService) {

        this.BookCaseForm = this.formBuilder.group({
            skuid: ['', [Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9 _-]{0,15}')]],
            name: ['', [Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9 _-]{0,15}')]],
            whatnot: ['', [Validators.required, Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9]{1,5}')]],
            type: [null, [Validators.required, Validators.pattern('[0-9]{1,10}')]],
            bookshelf: ['', [Validators.required, Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9]{1,5}')]],
            categoryCtrl: ['', [Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9]{0,20}')]],
            bookCount: [0, [Validators.pattern('[0-9]{1,10}')]],
            desc: ['', [Validators.maxLength(150), Validators.pattern('([ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9 \.\,\!\(\)\?\;\:\»\«_-]*(\r)?(\n)?)*')]],
            date_added: new FormControl(new Date()),
            date_modified: new FormControl(''),
            disabled: new FormControl(false),

        })


        this.stateGroupSelected = false
        this.cindex = -1

        this.progressAction = {
            isthemeProcessing: false,
            isProcessing: false,
            progressActionDataBar: 0
        }

        const RowData: BookCase = this.data.body
        let firstTime = true
        if (RowData) { this.patchValues() }


        // Alphabetic Group Autocomplete Suggestions of Library
        this.libSpace = this.whatnot.valueChanges.pipe(
            startWith(RowData ? this.whatnot.value : ''),
            // delay emits
            debounceTime(300),
            distinctUntilChanged(),
            tap(() => this.progressAction.isProcessing = true),
            // use switch map so as to cancel previous subscribed events, before creating new ones
            switchMap(value => {
                if (value && (value === '' || value.length < 1) || this.stateGroupSelected) { // remove double crud requests
                    // if no value is present, return null
                    return of(null)
                } else {

                    // lookup from smartdeep isense
                    return this.searchHttp(value, 'libraryspace')
                        .pipe(
                            map((space: LibrarySpace[]) => {
                                if (!space) { return [] }
                                this.libSpaceSelected = space // .map<any>((item: LibrarySpace) => ({ whatnot: item.whatnot, type: item.type }))
                                return space
                                    .filter(option => option.whatnot.toLowerCase().includes(value.toLowerCase()))
                            }),
                            finalize(() => firstTime = this.progressAction.isProcessing = this.stateGroupSelected = false)
                        )
                }
            }),
            tap(() => { if (RowData && firstTime) { this.OnInit() } }),
            tap(() => firstTime = this.progressAction.isProcessing = this.stateGroupSelected = false)
        )



        this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
            startWith(null),
            // delay emits
            debounceTime(300),
            distinctUntilChanged(),
            tap(() => this.progressAction.isthemeProcessing = true),
            switchMap(value => {
                if (!value && (value === null || value === '' || value.length < 1) || this.stateGroupSelected) { // remove double crud requests
                    // if no value is present, return null
                    return of(null)
                } else {
                    // lookup in database
                    return this.searchHttp(value, 'category').pipe(
                        map((cat: Category[]) => {
                            this.categorySelected = cat
                            return cat
                                .filter((item: Category) => item.name.toLowerCase().includes(value.toLocaleLowerCase()))
                                .sort((a: Category, b: Category) => {
                                    if (a.name < b.name) { return -1 }
                                    if (a.name > b.name) { return 1 }
                                    return 0
                                })
                                .map<string>((item: Category) => item.name)

                        }),
                        finalize(() => this.progressAction.isthemeProcessing = this.stateGroupSelected = false)
                    )
                }
            }),
            tap(() => this.progressAction.isthemeProcessing = this.stateGroupSelected = false)
        )

    }
    private OnInit(): void {
        // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        // Add 'implements OnInit' to the class.
        const RowData: BookCase = this.data.body

        this.libSpaceSelect({ selected: this.whatnot.value } as MatOption, RowData.bookshelf)

        this.bookshelf.setValue(RowData.bookshelf && RowData.bookshelf.length ? this.getBookShelvesIndex(RowData.bookshelf) : null)
    }

    private patchValues(): void {
        const RowData: BookCase = this.data.body
        // On Edit Window set editable Row Values
        this.BookCaseForm.patchValue({
            skuid: RowData.skuid && RowData.skuid.length ? RowData.skuid : '',
            name: RowData.name && RowData.name.length ? RowData.name : '',
            categoryCtrl: null,
            bookCount: 0,
            bookshelf: -1,
            type: RowData.type ? RowData.type : 0,
            whatnot: RowData.whatnot && RowData.whatnot.length ? RowData.whatnot : '',
            desc: RowData.desc && RowData.desc.length ? RowData.desc : '',
            date_added: (RowData.date_added ? RowData.date_added : ''),
            date_modified: (RowData.date_modified ? RowData.date_modified : ''),
            disabled: (RowData.disabled !== null ? !RowData.disabled : false),
        })

        console.log('test')

        this.categories.push(...RowData.categories && RowData.categories.length ? (RowData.categories) : [])
        // this.whatnot.setValue()
    }

    onNoClick(): void {
        this.dialogRef.close()
    }

    onSave(): void {

        if (this.BookCaseForm.valid) {

            const RowData: BookCase = this.data.body

            // Set URL
            const sUrl = config.apiUrl + middlebar + 'task' +
                middlebar + 'library' + middlebar + 'alloc' + middlebar + 'save'

            const editable: boolean = RowData ? true : false
            // this.data.body ? edit mode
            const _id: string = RowData ? RowData._id : null

            this.skuid.setValue(`${this.whatnot.value}${this.bookshelves[this.bookshelf.value].name}-${!editable ? uid(5) : this.skuid.value.substring(this.skuid.value.indexOf('-') + 1)}`)

            const data: BookCase = {

                skuid: this.skuid.value,
                name: this.name.value,
                whatnot: this.whatnot.value,
                type: this.type.value,
                bookshelf: this.bookshelves[this.bookshelf.value].name,
                categories: this.categories,
                desc: this.desc.value,
                books: {
                    count: 0,
                    arrIndex: []
                },
                // bookshelves: result.bookcase.bookshelves,
                date_added: editable ? new Date(this.date_added.value) : new Date(),
                date_modified: editable ? new Date() : null,
                disabled: editable ? !this.disabled.value : false,
                recyclebin: false
            }

            // contain _id to run Mongo db method as update function
            if (editable) { addObjAttr(data, '_id', _id) }

            let dataPlus = null

            if (editable) {
                dataPlus = { // update old bookshelf us unused
                    whatnot: RowData.whatnot,
                    bookshelf: RowData.bookshelf,
                }
            }

            const dialogObj: BodyObj = {
                col: 'bookcase',
                data,
                dataPlus
            }

            if (!editable) { addObjAttr(dialogObj, 'uniqueId', [{ 'whatnot': data.whatnot, 'bookshelf': data.bookshelf }]) }


            // save data to DB
            this.saveByHttpWithProgress(dialogObj, sUrl)
                .subscribe((res: OptionEntry) => {

                    // Close Dialog Box
                    if (res && res.code == 200) { this.dialogRef.close(res.code) }
                    else {

                        console.error(res.error.status)
                    }
                    this.progressAction.progressActionDataBar = 0

                }, (error: any) => {
                    console.log(error)
                    // this.progressActionDataBar = 0
                })
        }

    }

    private saveByHttpWithProgress(formData: any, URL: string): Observable<OptionEntry> {
        return this.httpService.saveTaskswithProgress(formData, URL)
            .pipe(
                uploadProgress((progress: number) => (this.progressAction.progressActionDataBar = progress)),
                toResponseBody(),
                debounceTime(500),
                tap((result) => {
                    console.log('Saved results -->', result)

                    return result
                }),
                catchError(this.httpService.handleError<any>('saveByHttpwithProgress'))
            )
    }

    libSpaceSelect(option: MatOption, bs?: string): void {

        this.bookshelves = [], this.type.setValue(null)

        if (option.selected && this.libSpaceSelected && this.libSpaceSelected.length) {

            const libspaceSel: LibrarySpace = this.libSpaceSelected.find(o => o.whatnot === this.whatnot.value)
            this.type.setValue(libspaceSel.type)
            this.bookshelves.push(...libspaceSel && libspaceSel.bookshelves ? !bs ? libspaceSel.bookshelves.filter(e => !e.used) : libspaceSel.bookshelves.filter(e => !e.used || e.name === bs) : [])

        }
        // console.log(this.bookshelves)
        this.stateGroupSelected = true
    }

    getBookShelvesIndex(s: string): number {
        return this.bookshelves.findIndex(e => e.name === s)
    }

    categoryAdd(event: MatChipInputEvent): void {
        // Add fruit only when MatAutocomplete is not open
        // To make sure this does not conflict with OptionSelected Event
        if (!this.matCategoryAutocomplete.isOpen) {
            const input = event.input
            const value = event.value

            if (this.categorySelected && this.categorySelected.length) {
                this.cindex = this.categorySelected.findIndex((search) => search.name === value.trim())
            }

            // Add our fruit
            if (this.cindex !== -1 && this.categories && this.categories.findIndex(sa => sa.name === value.trim()) === -1 && (value || '').trim()) {
                this.categories.push({ _id: MongoId(this.categorySelected[this.cindex]._id), name: value.trim() })
            }


            // Reset the input value
            if (input) {
                input.value = '';
            }

            this.categoryCtrl.setValue(null)
        }
    }


    categoryRemove(shelf: { _id: string | ObjectID, name: string }) {
        this.removeElement(this.categories, shelf)
        // push to AllShelves
        // this.allShelves.push(shelf)
        // globalSort(this.allShelves)
    }



    categoryOptionSelected(event: MatAutocompleteSelectedEvent): void {

        const value = event.option.viewValue

        if (this.categorySelected && this.categorySelected.length) {
            this.cindex = this.categorySelected.findIndex((search) => search.slug === value.trim().toLowerCase())
        }


        // remove from allShelves
        // this.removeElement(this.allShelves, event.option.viewValue)

        if (this.cindex !== -1 && this.categories && this.categories.findIndex(sa => sa.name === value.trim()) === -1) {
            this.categories.push({ _id: MongoId(this.categorySelected[this.cindex]._id), name: value.trim() })
        }

        // console.log()
        this.categoryInput.nativeElement.value = ''
        this.categoryCtrl.setValue(null)
    }


    // <mat-error *ngIf="email.invalid">{{getErrorMessage()}}</mat-error>
    protected getErrorMessage(build: FormControl, key: string) {
        if (build.hasError('required')) {
            return 'You must enter a value'
        }

        return build.hasError(key) ? 'Not a valid ' + key : ''
    }

    private removeElement(arr: any, shelf: { _id: string | ObjectID, name: string }): void {

        const shelves = arr
        const index = shelves.findIndex((search => search._id = shelf._id))
        if (index >= 0) {
            shelves.splice(index, 1)
        }
    }


    private searchHttp(filteredValue: string, collectionName: string): Observable<any[]> {

        return this.httpService.searchTasks(filteredValue.toLowerCase(),
            config.apiUrl + middlebar + 'task' +
            middlebar + 'library' + middlebar + 'search', collectionName)
    }

    get skuid() {
        return this.BookCaseForm.get('skuid')
    }

    get name() {
        return this.BookCaseForm.get('name')
    }

    get whatnot() {
        return this.BookCaseForm.get('whatnot')
    }

    get type() {
        return this.BookCaseForm.get('type')
    }

    get bookshelf() {
        return this.BookCaseForm.get('bookshelf')
    }


    get categoryCtrl() {
        return this.BookCaseForm.get('categoryCtrl')
    }

    get bookCount() {
        return this.BookCaseForm.get('bookCount')
    }

    get desc() {
        return this.BookCaseForm.get('desc')
    }

    get date_added() {
        return this.BookCaseForm.get('date_added')
    }

    get date_modified() {
        return this.BookCaseForm.get('date_modified')
    }

    get disabled() {
        return this.BookCaseForm.get('disabled')
    }


}
