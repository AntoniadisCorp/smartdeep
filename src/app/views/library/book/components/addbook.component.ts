import { Component, Inject, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { NgbTypeaheadConfig, NgbProgressbarConfig, NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { ITEM_DATA, MENUBTN_ORDER_PROCESS, ACTIONBTN_ORDER_PROCESS, config, middlebar, DEFAULT_SESSION, DEFAULT_IMAGE } from 'src/app/variables';
import { InventoryTableColumns, Item, IDropDownMenu, Category, Library, BodyObj, OptionEntry, StateGroup, BookCase } from 'src/app/interfaces';
import { Observable, of, observable, fromEvent, merge, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, startWith, tap, switchMap, finalize, catchError, filter } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { SmartEngineService, Logger, SvgIconService, RandomNumberService } from 'src/app/services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Book, ImageSnippet } from '../../../../classes';
import { requiredFileType, toFormData, replaceAll, toResponseBody, uploadProgress, convertJsontoFormData, globalSort, _AlphaBeticSort, openMatDialog, _filter, escapeRegex } from 'src/app/routines';
import { MatTooltip, MatTableDataSource, MatPaginator, MatSort, MatCheckboxChange } from '@angular/material';
import { DashboardComponent } from '../../../dashboard/dashboard.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-library-addbook-dialog',
    templateUrl: 'dialog/addbook-dialog.component.html',
})
export class AddBookDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<AddBookDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onOpenBook(): void {
        this.data.status = true;
    }

}


export interface PeriodicElement {
    _id?: string;
    position: number;
    skuid: string;
    type: number;
    whatnot: number;
    bookshelf: string;
    categories: { _id: string, name: string }[];
    books: { count: number, arrIndex: { _id: string, bookshelfNo: number }[] };
}

@Component({
    selector: 'app-library-addbookcase-dialog',
    templateUrl: 'dialog/addbookcase-dialog.component.html',
    styles: [`
        /* Structure */
        table {
            width: 100%;
        }

        .mat-form-field {
            font-size: 14px;
            width: 100%;
        }
        .spinner-container {
            position: relative;
            width: 300px;
            height: 1px;
            display: initial;
            bottom: 100px;
        }

        .spinner-container mat-spinner {
            margin: 90px auto 0 auto;
        }
        
    `]
})
export class AddBookCaseDialogComponent implements AfterViewInit {


    @ViewChild('search', { static: false }) search: ElementRef;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;


    protected isLoadingResults: boolean = true
    protected isRateLimitReached: boolean = false;
    protected isDataLength: number;

    protected dataSource = new MatTableDataSource<PeriodicElement>([]);
    protected selection = new SelectionModel<PeriodicElement>(true, []);
    private tableAction: boolean = false;
    private apiUrl: { searchUrl: string, deleteUrl?: (col: string, id: string | number) => string, deleteManyUrl: string };

    displayedColumns: string[] = ['select', 'skuid', 'type', 'whatnot', 'bookshelf', 'books', 'categories'];


    protected extraFilters: Array<{ [x: string]: any }>
    protected bookshelfNo: FormControl
    protected booksPos: number[]

    // On Edit Window set editable Row Values
    private RowData: any = this.data.body


    constructor(
        public dialogRef: MatDialogRef<AddBookCaseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private httpService: SmartEngineService) {


        this.initForm()
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {


        // if any value selected trully
        if (!this.selection.hasValue())
            return


        /* // Set URL
        const sUrl = config.apiUrl + middlebar + 'task' +
            middlebar + 'library' + middlebar + 'alloc' + middlebar + 'save' */
        /*  this.data.status = true; */

        const selectedRow: PeriodicElement = this.selection.selected[0]

        const data: any = {

            _id: selectedRow._id,
            whatnot: selectedRow.whatnot,
            bookshelf: selectedRow.bookshelf,
            bookshelfNo: this.bookshelfNo.value > 0 ? this.bookshelfNo.value : selectedRow.books.count,
            oldbookshelfNo: this.RowData && this.RowData.bookshelfNo ? this.RowData.bookshelfNo : null,
            categories: selectedRow.categories
        }

        // console.log(selectedRow.books.count)

        this.dialogRef.close(data);
    }

    private initForm() {


        // init API URL for CRUD ACTIVITIES
        this.apiUrl = {
            searchUrl: `${config.apiUrl}${middlebar}task${middlebar}library${middlebar}space${middlebar}search`,
            // deleteUrl: (col: string, id: string | number) => `${config.apiUrl}${middlebar}task${middlebar}library${middlebar}alloc${middlebar}del${middlebar}${col}${middlebar}${id}`,
            deleteManyUrl: '',
        }
        this.extraFilters = []

        this.bookshelfNo = new FormControl(null)

        if (this.RowData) this.OnInit()
    }
    private OnInit(): void {
        // console.log('test...')
        // this.switchCheckbox(true, Row)
    }

    // private applyFilter(event?: Event) {
    //     const filterValue = (this.search.nativeElement as HTMLInputElement).value;
    //     this.dataSource.filter = filterValue.trim().toLowerCase();


    // }

    ngAfterViewInit(): void {
        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.

        this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0))

        fromEvent(this.search.nativeElement, 'keyup')
            .pipe(
                debounceTime(200),
                distinctUntilChanged(),
                tap(() => {
                    this.paginator.pageIndex = 0;
                }),
                switchMap((value: string) => {
                    this.isLoadingResults = true;
                    return this.loadPage(this.isEditing() && value.length ? this.RowData.bookcaseId : '');
                }),
                map((data: any) => {
                    // Flip flag to show that loading has finished.
                    this.isLoadingResults = false;
                    this.isRateLimitReached = false;
                    this.isDataLength = data.count;

                    return data.result;
                }),
                catchError(() => {
                    this.isLoadingResults = false;
                    // Catch if the GitHub API has reached its rate limit. Return empty data.
                    this.isRateLimitReached = true;
                    return of([]);
                })
            )
            .subscribe(data => (this.dataSource.data = data, this.updateFields(data)/* , this.applyFilter() */))



        // setup table paginator - sort
        merge(this.sort.sortChange, this.paginator.page)
            .pipe(
                startWith({}),
                switchMap((value: string) => {

                    this.isLoadingResults = true;

                    return this.loadPage(this.isEditing() && value.length ? this.RowData.bookcaseId : '');
                }),
                map((data: any) => {
                    // Flip flag to show that loading has finished.
                    this.isLoadingResults = false;
                    this.isRateLimitReached = false;
                    this.isDataLength = data.count;

                    return data.result;
                }),
                catchError(() => {
                    this.isLoadingResults = false;
                    // Catch if the GitHub API has reached its rate limit. Return empty data.
                    this.isRateLimitReached = true;
                    return of([]);
                })
            )
            .subscribe((data: PeriodicElement[]) => (this.dataSource.data = data, this.updateFields(data)))

    }

    private updateFields(data: PeriodicElement[]): void {


        if (this.RowData && data.length && this.RowData.bookcaseId) {
            this.switchCheckbox(true,
                data.filter(v => v._id.toLowerCase().indexOf(this.RowData.bookcaseId.toLowerCase()) > -1)[0]
            )
            this.arrIndexNo()
        }
    }


    private arrIndexNo(): void {

        const { slHasValue, index, arrIndex } = this.arrIndexNoisSelected()

        if (!slHasValue)
            return

        if (index > -1) this.bookshelfNo.setValue(arrIndex[index].bookshelfNo - 1)

        if (this.RowData && !this.RowData.bookshelfNo) this.RowData.bookshelfNo = this.bookshelfNo.value


        // return index

    }

    private arrIndexNoisSelected(): any {

        if (!this.selection.hasValue() || !this.isEditing())
            return { slHasValue: false }

        const arrIndex = this.selection.selected[0].books.arrIndex

        const index: number = arrIndex.findIndex(s => s._id === this.RowData._id)

        return { slHasValue: true, index, arrIndex }
    }


    /* ------------------------ Οn Table Load ---------------------------- */
    protected loadPage(RowData: any = ''): Observable<PeriodicElement[]> {
        // this.sort.sortables.forEach( (v,k) => console.log(v, k))


        this.masterToggle()
        return this.httpService.find(
            RowData,
            this.search.nativeElement.value.trim().toLowerCase(),
            this.sort.direction,
            this.paginator.pageIndex + 1,
            this.paginator.pageSize,
            'bookcase',
            this.apiUrl.searchUrl,
            this.sort.active,
            JSON.stringify(this.extraFilters)
        );
    }

    /* ------------------------ Table Row Acts ---------------------------- */
    protected onRowClicked(Row: PeriodicElement) {


        if (!this.tableAction)
            this.switchCheckbox(!this.selection.isSelected(Row), Row)
        else this.tableAction = false
        // this.router.navigate(['/library/book/view', Row._id])
    }

    /* ------------------------ On Clear Search Table ---------------------------- */
    protected clearSearch() {
        this.search.nativeElement.value = '';
        this.masterToggle()
        this.loadPage(this.isEditing() ? this.RowData.bookcaseId : '')
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
                    this.isDataLength = data.count;

                    return data.result;
                }),
                catchError(() => {
                    this.isLoadingResults = false;
                    // Catch if the GitHub API has reached its rate limit. Return empty data.
                    this.isRateLimitReached = true;
                    return of([]);
                })
            ).subscribe(data => (this.dataSource.data = data, this.updateFields(data)));
    }

    private isEditing(): boolean {
        return !!this.RowData as boolean /* && this.search.nativeElement.value.trim().toLowerCase() === '' */
    }

    /** Whether the number of selected elements matches the total number of rows. */
    protected isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    protected masterToggle() {
        this.selection.hasValue() ?
            this.selection.clear() :
            null;
    }

    protected nodeToggle(event: MatCheckboxChange, row: PeriodicElement) {

        this.switchCheckbox(event.checked, row)
    }
    /** The label for the checkbox on the passed row */
    protected checkboxLabel(row?: PeriodicElement): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
    }

    private switchCheckbox(checked: boolean, row: PeriodicElement): void {

        checked ? (this.masterToggle(), this.selection.select(row)) : this.masterToggle()

        // Create checkbox to choose position
        this.booksPos = Array.apply(null,
            {
                length:
                    this.selection.selected[0] && (this.arrIndexNoisSelected().index > -1) ?
                        this.selection.selected[0].books.count :
                        this.selection.selected[0] ? this.selection.selected[0].books.count + 1 : 0
            }).map(Number.call, Number)

        // console.log(`count book: ${this.isEditing()}  ${this.selection.selected[0].books.count}`, this.arrIndexNoisSelected().index)
    }

}

@Component({
    selector: 'app-library-addcategory-dialog',
    template: `dialog/addcategory-dialog.component.html`,
    styles: [``]
})
export class AddCategoryDialogComponent extends DashboardComponent {

    constructor(public dialogRef: MatDialogRef<AddCategoryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        httpService: SmartEngineService) {
        super(httpService);
    }
    ngOnInit(): void { }


    onNoClick(): void {
        this.dialogRef.close();
    }

    onOpenBook(): void {
        this.data.status = true;
    }
}



@Component({
    selector: 'app-library-addbook',
    templateUrl: './addbook.component.html',
    styleUrls: ['./addbook.component.scss'],
    providers: [NgbTypeaheadConfig, NgbProgressbarConfig] // add NgbTypeaheadConfig to the component providers
})
export class AddbookComponent implements OnInit, AfterViewInit {


    @ViewChild('categoryTooltip', { static: false }) categoryTooltip: MatTooltip
    @ViewChild('instance', { static: true }) instance: NgbTypeahead;
    focus$ = new Subject<string>();
    click$ = new Subject<string>();

    private categorySate: Category[];
    private libraryState: Library[];
    public catSearch: string;
    public catlen: number = 0;

    stateGroupOptions: Observable<StateGroup[]>;
    stateGroupSelected: boolean
    entranceForm: FormGroup

    fontSize = '18px';

    private states: string[] = []

    isProcessing = false;
    progress = -1;
    SearchCategory: any;
    entranceGate: boolean;
    avatarFile: ImageSnippet;

    constructor(
        private httpService: SmartEngineService,
        private route: ActivatedRoute,
        private ngbconfig: NgbTypeaheadConfig,
        private ngbprogr: NgbProgressbarConfig,
        private formBuilder: FormBuilder,
        private logger: Logger,
        private elRef: ElementRef,
        private dialog: MatDialog, matIconRegistry: SvgIconService,
        private cdr: ChangeDetectorRef,
        private randService: RandomNumberService,
        private router: Router) {


        matIconRegistry.setSvg('bookshelf', 'assets/img/svg/bookshelf.svg')
        matIconRegistry.setSvg('bookshelfNo', 'assets/img/svg/bookshelfNo.svg')
        // customize default values of progress bars used by this component tree
        ngbprogr.max = 100;
        ngbprogr.striped = true;
        ngbprogr.animated = true;
        ngbprogr.type = 'info';
        ngbprogr.height = '20px';
    }

    ngOnInit(): void {



        this.ngbconfig.showHint = true;

        this.stateGroupSelected = false;

        this.entranceGate = true;

        this.createBookForm()

        this.setComponentFonts();
    }

    ngAfterViewInit(): void {


        this.getLibrary()
        this.getBookSKU()

        this.cdr.detectChanges()
    }

    private getLibrary(): void {

        let currLib: Library = DEFAULT_SESSION.user._session.library
        this.libraryState = []


        if (!currLib._id)
            this.randService.getLibrary()
                .subscribe((res: any) => {
                    currLib = DEFAULT_SESSION.user._session.library = res._session.library as Library

                    this.libraryName.setValue(currLib.name ? currLib.name : '', { emitEvent: false })
                    this.libraryState.push(currLib) // refresh library state


                })
        this.libraryName.setValue(currLib.name ? currLib.name : '', { emitEvent: false })
        this.libraryState.push(currLib) // refresh library state


    }

    private getBookSKU(): void {

        // string Url
        const sUrl = config.apiUrl + middlebar + 'task' +
            middlebar + 'library' + middlebar + 'book' + middlebar + 'sku'

        // http SKU Service
        if (!this.SKU.value)
            this.httpService.getTask(sUrl)
                .pipe(map((res: OptionEntry) => res.data ? res.data.result : res))
                .subscribe(res => {
                    // console.log('SKU: ', res)
                    this.SKU.setValue(res)
                })
    }

    private createBookForm(): void {

        this.createForm()

        this.clearAvatar()

        this.obsFilterLibrary()

        /* UPDATE - EDIT BOOK BY ID */

        if (
            this.route.snapshot.data._id &&
            this.route.snapshot.data._id.code === 200
        ) {
            this.entranceSelected()
            this.catlen = -1

            // fetching data
            const fetchbook: Book = this.route.snapshot.data._id.data.result

            this.avatarFile = new ImageSnippet(fetchbook.avatar.src, fetchbook.avatar.file)
            // this.books.get('avatar').setValue(fetchbook.avatar.file)
            // patch data    
            this.books.patchValue({
                _id: fetchbook._id,
                SKU: fetchbook.SKU,
                title: fetchbook.name,
                bookcase: {
                    bookcaseId: fetchbook.bookcase._id,
                    bookcaseName: fetchbook.bookcase.whatnot + fetchbook.bookcase.bookshelf + (fetchbook.bookcase.bookshelfNo),
                    whatnot: fetchbook.bookcase.whatnot,
                    bookshelf: fetchbook.bookcase.bookshelf,
                    bookshelfNo: fetchbook.bookcase.bookshelfNo > 0 ? fetchbook.bookcase.bookshelfNo - 1 : 0,
                },

                author: fetchbook.author,
                publisher: fetchbook.publisher,
                year: fetchbook.year,
                pages: fetchbook.pages,
                volume: fetchbook.volume,
                version: fetchbook.version,
                dimensions: fetchbook.dimensions,
                isbn10: fetchbook.isbn10,
                isbn13: fetchbook.isbn13,
                status: fetchbook.status,
                notes: fetchbook.notes,
                avatar: { src: fetchbook.avatar.src, storageUrl: fetchbook.avatar.storageUrl, file: fetchbook.avatar.file }
            })

            // get category by id
            this.categorySate = []
            this.getCategorybyId(fetchbook.categoryId as string, 'category')
                .pipe(map((res: OptionEntry) => res.data.result))
                .subscribe((item: Category) => {

                    if (!item) return

                    this.categorySate.push(item)
                    this.catlen = 1
                    this.category.patchValue({ cid: item._id, cname: item.name }, { emitEvent: false })
                    this.openLibrary()
                })
        }



        this.onChanges()
    }

    private createForm(): void {

        this.entranceForm = this.formBuilder.group({
            libraryName: ['', [Validators.required, Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9 _-]{5,50}')]],
            books: this.formBuilder.group({
                _id: [null],
                SKU: [null, [Validators.required, Validators.pattern('[0-9]+')]],
                category: this.formBuilder.group({
                    cid: new FormControl(['']),
                    cname: new FormControl([''], [Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9 _-]+')]),
                }),
                title: ['', [Validators.required, Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9 _-]+')]],
                bookcase: this.formBuilder.group({
                    bookcaseName: [{ value: '', disabled: true }, [Validators.required /*, Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z]{1,2}[0-9]{1,8}') */]],
                    bookcaseId: ['',],
                    whatnot: ['', [Validators.required, Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9]{1,5}')]],
                    bookshelf: ['', [Validators.required, Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9]{1,5}')]],
                    bookshelfNo: ['', [Validators.required, Validators.pattern('[0-9]{1,10}')]],
                    oldbookshelfNo: [''],
                }),
                version: [null, [Validators.min(0), Validators.pattern('[0-9]+')]],
                volume: [null, [Validators.min(0), Validators.pattern('[0-9]+')]],
                author: ['', Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9 _-]*')],
                publisher: ['', Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9 _-]*')],
                year: [null, [Validators.min(0), Validators.pattern('[0-9]+')]],
                pages: [null, [Validators.min(0), Validators.pattern('[0-9]+')]],
                dimensions: this.formBuilder.group({
                    x: [null, [Validators.min(0), Validators.max(999)]],
                    y: [null, [Validators.min(0), Validators.max(999)]],
                }),
                isbn10: [null, [Validators.maxLength(10), Validators.pattern('([0-9]{10})*')]],
                isbn13: [null, [Validators.maxLength(13), Validators.pattern('([0-9]{13})*')]],
                status: true,
                notes: ['', [Validators.maxLength(3000), Validators.pattern('([ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9 \.\,\!\(\)\?\;\:\»\«_-]*(\r)?(\n)?)*')]], // \'\""
                avatar: [null, requiredFileType(['png', 'jpg'], true)],
            }),
        })
    }

    private obsFilterLibrary(): void {

        const sUrl = config.apiUrl + middlebar + 'task' +
            middlebar + 'library' + middlebar + 'search'

        // Alphabetic Group Autocomplete Suggestions of Library
        this.stateGroupOptions = this.libraryName.valueChanges
            .pipe(
                startWith(''),
                // delay emits
                debounceTime(300),
                distinctUntilChanged(),
                tap(() => this.isProcessing = true),
                // use switch map so as to cancel previous subscribed events, before creating new ones
                switchMap(value => {
                    if (value === '' || value.length < 1 || this.stateGroupSelected) { // remove double crud requests
                        // if no value is present, return null
                        return of(null);
                    } else {

                        // lookup from smartdeep isense
                        return this.searchHttp(value, sUrl, 'library').pipe(
                            map((lib: Library[]) => {
                                if (!lib) return []
                                this.libraryState = lib;
                                const k = lib.map<string>((item: Library) => item.name);
                                return this._filterGroup(value, k);
                            }),
                            finalize(() => this.isProcessing = this.stateGroupSelected = false)
                        );
                    }
                }),
                tap(() => this.isProcessing = this.stateGroupSelected = false)
            );

    }

    /* formatter = (state: Category) => state.name; */

    onFormSubmit(): void {

        console.log(this.entranceForm.value)
        if (!this.entranceForm.valid) {

            this.logger.log('Το βιβλίο δεν καταχωρήθηκε!', 5000)
            openMatDialog(this.dialog, {
                title: `Το βιβλίο ${this.title.value ? this.title.value : ''} δεν μπορεί να δημιουργηθεί!`,
                image: {
                    icon: 'times-circle',
                    color: 'alert-danger'
                },
                text: `Θέλετε να επιστρέψετε;`,
                status: false
            }, AddBookDialogComponent)
                .afterClosed()
                .subscribe(result => {
                    console.log('The dialog was closed', result);

                }, '400px');
            return
        }

        let _title = this.title.value
        let formData: FormData = convertJsontoFormData(this.entranceForm.value)
        console.log(formData.get('_id').toString())
        // search for category ID
        /* const currCategory: Category = this.categorySate
            .find(o => o.name === this.name.value) */

        formData.append('libraryId', this.libraryState[0]._id)
        formData.append('categoryId', this.category.get('cid').value)
        formData.append('col', 'book')

        this.logger.log('Αποθήκευση ' + _title + ' περιμένετε...')

        // UPDATE FORM
        if (this.route.snapshot.data._id) {

            // console.log(this.route.snapshot.data, formData.get('_id'))

            if (this.route.snapshot.data._id.code === 200) {
                this.updateFormByHttp(formData).subscribe((result: any) => {
                    let data = {
                        title: `To Βιβλίο ${_title} δεν ενημερώθηκε!`,
                        image: {
                            icon: 'times-circle',
                            color: 'alert-danger'
                        },
                        text: `Θέλετε να επιστρεψετε πίσω;`,
                        status: false
                    }

                    if (result.code === 200 && _title) {

                        this.logger.log('Το βιβλίο ενημερώθηκε με επιτυχία!', 5000)
                        data = {
                            title: `Το βιβλίο ${_title} αποθηκεύτηκε επιτυχώς!`,
                            image: {
                                icon: 'check-circle',
                                color: 'alert-success'
                            },
                            text: `Θέλετε να δημιουργήσετε νέο Βιβλίο?`,
                            status: false
                        }

                    } else {
                        this.logger.log(`Το βιβλίο μπορεί να αποθηκευτεί, επέστρεψε σφάλμα με κωδικό ${result.code}!`, 4000)
                    }

                    openMatDialog(this.dialog, data, AddBookDialogComponent, '400px')
                        .afterClosed()
                        .subscribe(result => {
                            console.log('The dialog was closed', result);
                            this.progress = -1;

                        })
                })
            }
        }
        // ADD FORM
        else this.createFormByHttp(formData)
            .subscribe(
                (result: OptionEntry) => this.onBookResult(result),
                (err: HttpErrorResponse) => this.onBookCreationCatchErr(err)
            )
    }

    private onBookResult(result: OptionEntry): void {

        let data = {
            title: `To Βιβλίο ${this.title.value} δεν δημιουργήθηκε!`,
            image: {
                icon: 'times-circle',
                color: 'alert-danger'
            },
            text: `Θέλετε να επιστρεψετε πίσω;`,
            status: false
        }
        if (result.code === 200 && this.title.value) {

            this.logger.log('Το βιβλίο δημιουργήθηκε με επιτυχία!', 5000)
            data = {
                title: `Το βιβλίο ${this.title.value} μόλις δημιουργήθηκε!`,
                image: {
                    icon: 'check-circle',
                    color: 'alert-success'
                },
                text: `Θέλετε να δημιουργήσετε ένα νέο βιβλίο?`,
                status: false
            }

        } else {
            this.logger.log(`Το βιβλίο μπορεί να δημιουργηθεί, επέστρεψε σφάλμα με κωδικό ${result.code}!`, 4000)
        }

        // return and insert new Book
        this.progress = -1;
        this.resetBookForm()

        // Dialog Modal Window
        openMatDialog(this.dialog, data, AddBookDialogComponent, '300px', '350px')
            .afterClosed()
            .subscribe(res => {
                console.log('The dialog was closed', res);
                if (!res)
                    return
                if (res.status)
                    this.router.navigate(['' + this.route.snapshot.url.join(''), result.data.result._id])
            })
    }

    private onBookCreationCatchErr(err: HttpErrorResponse): void {

        this.progress = -1;
        this.logger.log(`Το βιβλίο μπορεί να δημιουργηθεί, επέστρεψε σφάλμα με κωδικό ${err.error.code}! ${err.error.data.message} `, 4000)
    }

    protected resetBookForm(): void {

        this.entranceForm.reset({
            libraryName: this.libraryName.value,
            books: {
                status: true,
                category: this.category.value
            }
        })

        this.clearAvatar()
    }

    protected clearAvatar(): void {

        this.avatarFile = new ImageSnippet()
        this.books.get('avatar').patchValue(null)
    }

    private isAvatar(): boolean {
        return this.avatarFile && this.avatarFile.src !== '' && this.avatarFile.src !== DEFAULT_IMAGE
    }

    private avatarOnChange(): void {
        this.books
            .get('avatar').valueChanges
            .subscribe(file => {

                if (file) this.avatarFile.showPreviewPic(file)
                // console.log('addbookImageFile: ', this.avatarFile.file)
            }, (err: any) => { console.log(err) })
    }


    public selectedCategory(ngbevent?: NgbTypeaheadSelectItemEvent) {
        // console.log(ngbevent.item)
        this.catlen = -1
        this.category.patchValue({ cid: ngbevent.item._id, cname: ngbevent.item.name }, { emitEvent: false })
        // this.entranceForm.patchValue({books: {category: ngbevent.item.name.toString()}}, {emitEvent: false})
    }

    private onChanges(): void {

        this.avatarOnChange()

        this.categoryObserv()
        //    
    }

    protected formatter = (x: { name: string }) => x.name;
    private formater2 = (s: { _id: string, name: string }) => ({ _id: s._id, name: s.name })

    private categoryObserv() {

        this.SearchCategory = (text$: Observable<string>) => {
            const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
            const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance ? null : !this.instance.isPopupOpen()));
            const inputFocus$ = this.focus$;

            // this.category.setValue({ _id: item._id, name: item.name }, { emitEvent: false })

            return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
                /* filter(term => term.length >= 2), */
                map(term => (term === '' ? (this.categorySate ? this.categorySate.map(this.formater2) : [])
                    : (this.categorySate ? this.categorySate.map(this.formater2) : []).filter(v => v.name.toLowerCase().indexOf(term.toLowerCase()) > -1)).slice(0, 10)),

            );
        }
        // const sUrl = config.apiUrl + middlebar + 'task' +
        //     middlebar + 'library' + middlebar + 'search'
        // /* config.apiUrl + middlebar + 'task' +
        //            middlebar + 'library' + middlebar + 'get' + middlebar + 'ids' */

        // this.SearchCategory = (text$: Observable<string>) =>
        //     text$.pipe(

        //         startWith(''),
        //         // delay emits
        //         debounceTime(300),
        //         distinctUntilChanged(),
        //         tap(() => { this.isProcessing = true, this.categoryTooltip.show() }),
        //         switchMap(value => {
        //             if (value === '' || value.length < 2) {
        //                 return of(null)
        //             } else {
        //                 this.catlen = 0
        //                 // lookup in database

        //                 return this.searchHttp(value, sUrl, 'category').pipe(
        //                     map((cat: Category[]) => {
        //                         this.categorySate = cat;
        //                         this.catlen = cat.length
        //                         return cat
        //                             .filter((item: Category) => item.name.toLowerCase().includes(value.toLocaleLowerCase()))
        //                             .sort((a: Category, b: Category) => {
        //                                 if (a.name < b.name) { return -1; }
        //                                 if (a.name > b.name) { return 1; }
        //                                 return 0;
        //                             })
        //                             .map<string>((item: Category) => item.name)

        //                     }),
        //                     finalize(() => this.isProcessing = false)
        //                 );
        //             }
        //         }),
        //         tap(() => { this.isProcessing = false }),
        //     );
    }

    /**
     * addBookshelf
     */
    public addBookshelf() {


        this.openBookCaseModal(this.bookcaseName.value.length ? this.bookcase.value : undefined)
    }

    private openBookCaseModal(editBookcase?: BookCase): void {

        let data = {
            title: `Αρίθμηση θέσεων στη βιβλιοθήκη`,
            subtitle: `${this.libraryName.value}`,
            image: {
                icon: '',
                color: 'alert',
                svg: 'bookshelfNo'
            },
            body: editBookcase ? (editBookcase._id = this._id.value, editBookcase) : null,
            text: ``,
            status: false
        }
            , width = '600px'
            , height = '550px';

        openMatDialog(this.dialog, data, AddBookCaseDialogComponent, width, height)
            .afterClosed()
            .subscribe((result: any) => {
                console.log('The dialog was closed:', result);
                if (!result) return
                this.bookcase.setValue({

                    bookcaseId: result._id,
                    whatnot: result.whatnot,
                    bookshelf: result.bookshelf,
                    bookshelfNo: result.bookshelfNo,
                    bookcaseName: result.whatnot + result.bookshelf + (result.bookshelfNo >= 0 ? ++result.bookshelfNo : result.bookshelfNo),
                    oldbookshelfNo: result.oldbookshelfNo
                })

                /* replaceAll(result.bookcase.name, '/', '') */
                const sUrl = config.apiUrl + middlebar + 'task' + middlebar + 'library' + middlebar + 'get' + middlebar + 'ids'

                if (result.categories && result.categories.length) {

                    this.getCategoriesByIds({ data: { ids: (result.categories as { _id: string, name: string }[]).map(v => v._id) }, col: 'category' }, sUrl).pipe(
                        map((e: OptionEntry) => e.data.result),
                        map((cat: Category[]) => {
                            console.log(cat)
                            this.categorySate = cat;
                            this.catlen = cat.length
                            return cat
                                .filter((item: Category) => item.name.toLowerCase().includes(''))
                                .sort((a: Category, b: Category) => {
                                    if (a.name < b.name) { return -1; }
                                    if (a.name > b.name) { return 1; }
                                    return 0;
                                })
                            /* .map<string>((item: Category) => item.name) */
                        })).subscribe((v: Category[]) => this.categorySate = v)
                }
            });
    }

    // public addCategoryModal(): void {
    //     let data = {
    //         title: `Προσθήκη Θεματολογίας`,
    //         subtitle: `${this.libraryName.value}`,
    //         image: {
    //             icon: '',
    //             color: 'alert',
    //             svg: 'bookshelfNo'
    //         },
    //         text: ``,
    //         status: false
    //     },
    //         width = '400px';

    //     // openMatDialog(this.dialog, data, /* BookCaseDialogComponent */, width)
    //     //     .afterClosed()
    //     //     .subscribe((result: any) => {
    //     //         console.log('The dialog was closed', result);
    //     //         this.bookcase.setValue(replaceAll(result.name, '/', ''))
    //     //     });
    // }

    public entranceSelected(): void {
        this.stateGroupSelected = true
    }

    public openLibrary() {

        this.entranceGate = !this.libraryName.valid;

        const currLib: Library = this.libraryState ? this.libraryState.find(o => o.name === this.libraryName.value) : { name: '' }
        // on open if not exist create one or use current. const obj2 = this.iFonts.find(o => o.name === this.iconCtrl.value);
        if (!this.entranceGate &&
            !currLib) {

            this.libraryState = []
            this.libraryState.push(currLib) // refresh library state

            // this.logger.log('Creating New Library..');
            /* const jsonObj: BodyObj = {
                data: {
                    // _id: new ObjectId().toHexString(),
                    name: this.libraryName.value,
                    date_added: new Date(),
                    recyclebin: false,
                    status: 'active'
                },
                col: 'library'
            }; */

            /* this.createHttp(jsonObj).subscribe(
                (response: OptionEntry) => {
                    this.logger.log(`${this.libraryName.value} successful created!`, 5000);
                    console.log(response && response.code ? response.code : null);
                }); */
        }

        if (this.entranceGate) {
            this.httpService.find('', '', '', 1, 1, 'book',
                config.apiUrl + middlebar + 'task' +
                middlebar + 'library' + middlebar + 'book/search')
                .pipe(map((res: any) => res.result)).subscribe(
                    (data: Book) => {
                        this._id.setValue(data[0]._id + 1)
                    })
        }
    }

    private searchHttp(filteredValue: string, sUrl: string, collectionName: string): Observable<any> {

        return this.httpService.searchTasks(filteredValue.toLowerCase(),
            sUrl, collectionName);
    }

    private getCategorybyId(id: string, collectionName: string): Observable<any> {

        return this.httpService.getTasks(config.apiUrl + middlebar + 'task' +
            middlebar + 'category' + middlebar + id.toLowerCase(), collectionName);
    }

    private getCategoriesByIds(jsonObj: BodyObj, sUrl: string): Observable<any> {

        return this.httpService.saveTasks(jsonObj, sUrl);
    }

    private createFormByHttp(formData: any): Observable<OptionEntry> {

        return this.httpService.saveTaskswithProgress(formData,
            config.apiUrl + middlebar + 'task' +
            middlebar + 'library' + middlebar + 'book' + middlebar + 'save')
            .pipe(
                uploadProgress(progress => (this.progress = progress)),
                toResponseBody(),
                tap((result) => {
                    console.log('Saved results -->', result);
                    return result;
                })
            );
    }

    private updateFormByHttp(formData: any): Observable<OptionEntry> {

        return this.httpService.saveTaskswithProgress(formData,
            config.apiUrl + middlebar + 'task' +
            middlebar + 'library' + middlebar + 'book' + middlebar + 'update')
            .pipe(
                uploadProgress(progress => (this.progress = progress)),
                toResponseBody(),
                tap((result) => {
                    console.log('Saved results -->', result);
                    return result;
                })
            );
    }

    private _filterGroup(value: string, arr: string[]): StateGroup[] {
        const stateGroups = _AlphaBeticSort(arr);
        if (value) {
            return stateGroups
                .map(group => ({ letter: group.letter, name: _filter(group.name, value) }))
                .filter(group => group.name.length > 0);
        }

        return stateGroups;
    }


    get libraryName() {
        return this.entranceForm.get('libraryName')
    }

    private get books() {
        return this.entranceForm.get('books')
    }

    get _id() {
        return this.books.get('_id')
    }
    get SKU() {
        return this.books.get('SKU')
    }
    get title() {
        return this.books.get('title')
    }
    get bookcase() {
        return this.books.get('bookcase')
    }

    get bookcaseName() {
        return this.bookcase.get('bookcaseName')
    }

    get category() {
        return this.books.get('category')
    }

    get cname() {
        return this.category.get('cname')
    }

    get volume() {
        return this.books.get('volume')
    }

    get version() {
        return this.books.get('version')
    }

    get author() {
        return this.books.get('author')
    }
    get publisher() {
        return this.books.get('publisher')
    }
    get year() {
        return this.books.get('year')
    }
    get pages() {
        return this.books.get('pages')
    }

    get isbn10() {
        return this.books.get('isbn10')
    }
    get isbn13() {
        return this.books.get('isbn13')
    }
    get notes() {
        return this.books.get('notes')
    }

    private setComponentFonts(): void {
        /* const matlabel: HTMLElement = this.elRef.nativeElement.querySelector('.mat-form-field-label');
        const matInput: HTMLElement = this.elRef.nativeElement.querySelector('.mat-input-element');
     
        matlabel.style.fontSize = '19px';
        matInput.style.fontSize = '19px'; */
    }
}


