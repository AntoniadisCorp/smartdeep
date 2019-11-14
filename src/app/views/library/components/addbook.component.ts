import { Component, Inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbTypeaheadConfig, NgbProgressbarConfig } from '@ng-bootstrap/ng-bootstrap';
import { ITEM_DATA, MENUBTN_ORDER_PROCESS, ACTIONBTN_ORDER_PROCESS, config, middlebar } from 'src/app/variables';
import { InventoryTableColumns, Item, IDropDownMenu, Category, Library, BodyObj, OptionEntry, StateGroup } from 'src/app/interfaces';
import { Observable, of } from 'rxjs';
import { debounceTime, map, distinctUntilChanged, startWith, tap, switchMap, finalize } from 'rxjs/operators';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SmartEngineService, Logger } from 'src/app/services';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Book, ImageSnippet } from '../../../classes';
import { requiredFileType, toFormData, toResponseBody, uploadProgress, convertJsontoFormData, globalSort, _AlphaBeticSort } from 'src/app/routines';

@Component({
    selector: 'app-library-addbook-dialog',
    templateUrl: 'addbook-dialog.component.html',
})
export class AddbookDialogComponent {

    constructor(
        public dialogRef: MatDialogRef<AddbookDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    onNoClick(): void {
        this.dialogRef.close();
    }

    onOpenBook(): void {
        this.data.status = true;
    }

}

const states = ['states'];


@Component({
    selector: 'app-library-addbook',
    templateUrl: './addbook.component.html',
    styleUrls: ['./addbook.component.scss'],
    providers: [NgbTypeaheadConfig, NgbProgressbarConfig] // add NgbTypeaheadConfig to the component providers
})
export class AddbookComponent implements OnInit {

    private categorySate: Category[];
    private libraryState: Library[];
    public catSearch: string;

    stateGroupOptions: Observable<StateGroup[]>;
    entranceForm: FormGroup

    fontSize = '18px';


    isProcessing = false;
    progress: number = -1;
    category: any;
    entranceGate: boolean;
    avatarFile: ImageSnippet;

    constructor(private httpService: SmartEngineService,
        private ngbconfig: NgbTypeaheadConfig,
        private ngbprogr: NgbProgressbarConfig,
        private formBuilder: FormBuilder,
        private logger: Logger,
        private elRef: ElementRef,
        public dialog: MatDialog) {
        // customize default values of progress bars used by this component tree
        ngbprogr.max = 100;
        ngbprogr.striped = true;
        ngbprogr.animated = true;
        ngbprogr.type = 'info';
        ngbprogr.height = '20px';
    }

    ngOnInit(): void {



        this.ngbconfig.showHint = false;

        this.entranceGate = true;

        this.createBookForm()

        this.setComponentFonts();
    }

    createBookForm(): void {

        this.entranceForm = this.formBuilder.group({
            libraryName: ['', Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9 _-]{5,50}')],
            books: this.formBuilder.group({
                _id: [0, Validators.pattern('[0-9]+')],
                categoryName: ['', Validators.required/* , Validators.pattern(new RegExp(/^[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9 _]*$/,'g')) */],
                title: ['', Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9 _-]+')],
                bookcase: ['', Validators.pattern('([ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z_-]{1,2}[0-9]+[0-9]+)')],
                author: ['', Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9 _-]*')],
                publisher: ['', Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9 _-]*')],
                year: ['', Validators.pattern(new RegExp('[0-9]+'))],
                pages: [null, Validators.pattern(new RegExp('[0-9]+'))],
                dimensions: this.formBuilder.group({
                    x: [0, Validators.max(100)],
                    y: [0, Validators.max(100)],
                }),
                isbn10: [null, Validators.pattern('([0-9]{10})*')],
                isbn13: [null, Validators.pattern('([0-9]{13})*')],
                status: true,
                notes: ['', Validators.pattern('([[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9 _-]+\.[[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9 _-]+(\r)?(\n)?)+')],
                avatar: [null, requiredFileType('png', false)],
            }),
        });

        this.httpService.find('', '', '', 1, 1, 'book',
            config.apiUrl + middlebar + 'task' +
            middlebar + 'library' + middlebar + 'book/search')
            .pipe(map((res) => res['result'])).subscribe(
                (data: Book) => {
                    this._id.setValue(data._id)
                })


        this.avatarFile = new ImageSnippet()

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
                    if (value === '' || value.length < 2) {
                        // if no value is present, return null
                        return of(null);
                    } else {

                        // lookup from smartdeep isense
                        return this.searchHttp(value, 'library').pipe(
                            map((lib: Library[]) => {
                                if (!lib) return []
                                this.libraryState = lib;
                                const k = lib.map<string>((item: Library) => item.name);
                                return this._filterGroup(value, k);
                            }),
                            finalize(() => this.isProcessing = false)
                        );
                    }
                }),
                tap(() => this.isProcessing = false)
            );

        this.category = (text$: Observable<string>) =>
            text$.pipe(

                startWith(''),
                // delay emits
                debounceTime(300),
                distinctUntilChanged(),
                tap(() => this.isProcessing = true),
                /* map(term => term.length < 2 ? []
                    : states.filter(v => v.toLowerCase().startsWith(term.toLocaleLowerCase())).splice(0, 10)), */
                switchMap(value => {
                    if (value === '' || value.length < 2) {
                        return of(null)
                    } else {
                        // lookup in database
                        return this.searchHttp(value, 'category').pipe(
                            map((cat: Category[]) => {
                                this.categorySate = cat;

                                const k = cat.map<string>((item: Category) => item.name);
                                globalSort(k);
                                return this._filter(k, value)
                            }),
                            finalize(() => this.isProcessing = false)
                        );
                    }
                }),
                tap(() => this.isProcessing = false),
            );



        this.onChanges()
    }


    onFormSubmit(): void {

        if (!this.entranceForm.valid) {

            this.logger.log('Το βιβλίο δεν καταχωρήθηκε!', 5000)
            this.openDialog({
                title: `Το βιβλίο ${this.title.value ? this.title.value : ''} δεν μπορεί να δημιουργηθεί!`,
                image: {
                    icon: 'times-circle',
                    color: 'alert-danger'
                },
                text: `Θέλετε να επιστρέψετε;`,
                status: false
            });
            return
        }

        let _title = this.title.value
        let formData: FormData = convertJsontoFormData(this.entranceForm.value)

        // search for category ID
        const currCategory: Category = this.categorySate
            .find(o => o.name === this.entranceForm.get('books').get('categoryName').value)

        formData.append('libraryId', this.libraryState[0]._id)
        formData.append('categoryId', currCategory._id)
        formData.append('col', 'book')

        this.logger.log('Creating a book ' + _title + '...')

        this.createFromHttp(formData).subscribe((result: any) => {
            if (result.code === 200) {

                if (_title) {
                    this.logger.log('Book sucessful created!', 5000)
                    this.openDialog({
                        title: `The Book ${_title} sucessful created!`,
                        image: {
                            icon: 'check-circle',
                            color: 'alert-success'
                        },
                        text: `Would you like to create an other one or to open the book?`,
                        status: false
                    });
                }

            } else {
                this.logger.log(`Book not created, return error ${result.code}!`, 4000)
                this.openDialog({
                    title: `Book ${_title} not created!`,
                    image: {
                        icon: 'times-circle',
                        color: 'alert-danger'
                    },
                    text: `Would you like to return or got to home?`,
                    status: false
                });
            }

            this.progress = -1;
            this.resetBookForm()
        })
    }

    private resetBookForm(): void {

        this.entranceForm.reset({
            libraryName: this.libraryName.value,
            books: {
                status: true,
                categoryName: this.entranceForm.get('books').get('categoryName').value
            }
        })
    }

    private onChanges(): void {

        this.entranceForm.get('books')
            .get('avatar').valueChanges
            .subscribe(file => {

                // console.log('addbookImageFile: ', file)
                if (file) this.avatarFile.showPreviewPic(file);
            })
    }


    private openDialog(data: any, width?: string): void {

        const dialogRef = this.dialog.open(AddbookDialogComponent, {
            // tslint:disable-next-line: no-bitwise
            width: width ? width : '250px',
            data
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // this.animal = result;
        });
    }

    public openLibrary() {

        this.entranceGate = !this.libraryName.valid;

        const currLib: Library = this.libraryState ? this.libraryState.find(o => o.name === this.libraryName.value) : { name: '' }
        // on open if not exist create one or use current. const obj2 = this.iFonts.find(o => o.name === this.iconCtrl.value);
        if (!this.entranceGate &&
            !currLib) {

            this.libraryState = []
            this.libraryState.push(currLib) // refresh library state

            this.logger.log('Creating New Library..');
            const jsonObj: BodyObj = {
                data: {
                    // _id: new ObjectId().toHexString(),
                    name: this.libraryName.value,
                    date_added: new Date(),
                    recyclebin: false,
                    status: 'active'
                },
                col: 'library'
            };

            this.createHttp(jsonObj).subscribe(
                (response: OptionEntry) => {
                    this.logger.log(`${this.libraryName.value} successful created!`, 5000);
                    console.log(response && response.code ? response.code : null);
                });
        }
    }

    private searchHttp(filteredValue: string, collectionName: string): Observable<any> {

        return this.httpService.searchTasks(filteredValue.toLowerCase(),
            config.apiUrl + middlebar + 'task' +
            middlebar + 'library' + middlebar + 'search', collectionName);
    }

    private createHttp(jsonObj: BodyObj): Observable<OptionEntry> {

        return this.httpService.saveTasks(jsonObj, config.apiUrl + middlebar + 'task' +
            middlebar + 'library' + middlebar + 'save');
    }

    private createFromHttp(formData: any): Observable<OptionEntry> {

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

    private _filterGroup(value: string, arr: string[]): StateGroup[] {
        const stateGroups = _AlphaBeticSort(arr);
        if (value) {
            return stateGroups
                .map(group => ({ letter: group.letter, name: this._filter(group.name, value) }))
                .filter(group => group.name.length > 0);
        }

        return stateGroups;
    }

    private _filter(opt: string[], value: string): string[] {
        const filterValue = value.toLowerCase();
        //  .splice(0, 10)
        return opt.filter(option => option.toLowerCase().includes(filterValue))
    }

    get libraryName() {
        return this.entranceForm.get('libraryName')
    }
    get _id() {
        return this.entranceForm.get('books').get('_id')
    }
    get title() {
        return this.entranceForm.get('books').get('title')
    }
    get bookcase() {
        return this.entranceForm.get('books').get('bookcase')
    }

    get author() {
        return this.entranceForm.get('books').get('author')
    }
    get publisher() {
        return this.entranceForm.get('books').get('publisher')
    }
    get year() {
        return this.entranceForm.get('books').get('year')
    }
    get pages() {
        return this.entranceForm.get('books').get('pages')
    }

    get isbn10() {
        return this.entranceForm.get('books').get('isbn10')
    }
    get isbn13() {
        return this.entranceForm.get('books').get('isbn13')
    }
    get notes() {
        return this.entranceForm.get('books').get('notes')
    }

    setComponentFonts(): void {
        /* const matlabel: HTMLElement = this.elRef.nativeElement.querySelector('.mat-form-field-label');
        const matInput: HTMLElement = this.elRef.nativeElement.querySelector('.mat-input-element');
    
        matlabel.style.fontSize = '19px';
        matInput.style.fontSize = '19px'; */
    }
}


