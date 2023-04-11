import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  startWith,
  map,
  switchMap,
  debounceTime,
  tap,
  finalize,
  distinctUntilChanged
} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { middlebar, config } from '../../../../variables';
import { SmartEngineService, Logger, InventoryService } from '../../../../services';
import { requiredFileType, _AlphaBeticSort } from '../../../../routines';
import { ImageSnippet, Book } from '../../../../classes';
import { Category, OptionEntry, Library } from '../../../../interfaces';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ActivatedRoute, Router } from '@angular/router';

export interface StateGroup {
  letter: string;
  name: string[];
  SKU?: string;
  avatar?: any;
  pages?: number;
}

@Component({
  selector: 'app-library-editbook',
  templateUrl: 'editbook.component.html',
  styleUrls: ['editbook.component.scss']
})
export class EditbookComponent implements OnInit {
  stateGroupOptions!: Observable<Book[]>;
  entranceForm!: FormGroup;
  avatarFile!: ImageSnippet;

  stateData$!: Observable<any>;

  fontSize = '18px';

  entranceGate!: boolean;
  isProcessing!: boolean;
  // tslint:disable-next-line: ban-types
  private Formtranslator!: Object;
  private booksState: Book[] = [];
  stateGroupSelected!: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private logger: Logger,
    private httpService: SmartEngineService,
    private invService: InventoryService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {


    this.ViewBookForm();
    /* this.route.snapshot.data.subscribe((data: { result: Book }) => {
        if (data.result) {
            this.booksState.push(data.result);
            this.title.setValue(this.booksState[0].name);
            this.openBook()
        }
      }) */
  }

  private ViewBookForm(): void {
    this.entranceGate = true;
    this.entranceForm = this.formBuilder.group({
      libraryName: [
        '' /* , Validators.pattern(new RegExp(/^[άΆ-ώΏαΑ-ωΩa-zA-Z0-9]$/)) */
      ],
      // books: this.formBuilder.group({
      _id: ['' /* , Validators.pattern(new RegExp('^[0-9]+$')) */],
      SKU: ['' /* , Validators.pattern(new RegExp('^[0-9]+$')) */],
      title: ['', [Validators.required, Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9 _-]+')]],
      pages: [null /* , Validators.pattern(new RegExp(/^[0-9]+$/)) */],
      bookcase: [
        '' /* , Validators.pattern(new RegExp(/^[άΆ-ώΏαΑ-ωΩa-zA-Z0-9]*$/)) */
      ],
      author: [
        '' /* , Validators.pattern(new RegExp(/^[άΆ-ώΏαΑ-ωΩa-zA-Z0-9]*$/)) */
      ],
      publisher: [
        '' /* , Validators.pattern(new RegExp(/^[άΆ-ώΏαΑ-ωΩa-zA-Z0-9]*$/)) */
      ],
      year: ['', Validators.pattern('[0-9]+')],

      categoryName: [
        '' /* , Validators.required, Validators.pattern(new RegExp(/^[άΆ-ώΏαΑ-ωΩa-zA-Z0-9]*$/)) */
      ],
      dimensions: this.formBuilder.group({
        x: [0 /* , Validators.max(100) */],
        y: [0 /* , Validators.max(100) */]
      }),
      isbn10: [
        null /* , Validators.pattern(new RegExp(/^(ISBN-[0-9]{10})*$/)) */
      ],
      isbn13: [
        null /* , Validators.pattern(new RegExp(/^(ISBN-[0-9]{13})*$/)) */
      ],
      status: [{ value: true, disabled: true }],
      notes: [
        '' /* , Validators.pattern(new RegExp(/^([άΆ-ώΏαΑ-ωΩa-zA-Z0-9]+\.[άΆ-ώΏαΑ-ωΩa-zA-Z0-9]+(\r)?(\n)?)+$/)) */
      ],
      avatar: [null]
      // }),
    });

    this.Formtranslator = {
      SKU: 'Κωδικός',
      bookcase: 'βιβλιοθέση',
      status: 'Κατάσταση',
      pages: 'Αριθμός Σελίδων',
      dimensions: 'Διαστάσεις',
      year: 'Έτος Έκδοσης',
      author: 'Συγγραφέας',
      publisher: 'Εκδότης',
      isbn10: 'ISBN10',
      isbn13: 'ISBN13',
      notes: 'Σημειώσεις'
    };

    this.avatarFile = new ImageSnippet();

    this.onChanges();

    this.stateGroupSelected = false

    if (this.title !== null)
      this.stateGroupOptions =
        this.title.valueChanges.pipe(
          startWith(''),
          // delay emits
          debounceTime(300),
          // distinctUntilChanged(),
          tap(() => (this.isProcessing = true)),
          // use switch map so as to cancel previous subscribed events, before creating new ones
          switchMap(value => {
            if (value === '' || value.length < 1 || this.stateGroupSelected) {
              // if no value is present, return null
              return of(null);
            } else {
              // lookup from smartdeep isense
              return this.searchHttp(value, 'book').pipe(
                map((books: Book[]) => {
                  if (!books) {
                    return [];
                  }
                  this.booksState = books;
                  // const k = books.map<any>((item: Book) => { return item
                  /* return {
                                        name: item.name,
                                        _id: item._id,
                                        avatar: item.avatar,
                                        pages: item.pages
                                    } */
                  // });
                  // console.log(k)
                  return books;
                  // return this._filterGroup(value, k);
                }),
                finalize(() => (this.isProcessing = this.stateGroupSelected = false))
              );
            }
          }),
          tap(() => (this.isProcessing = this.stateGroupSelected = false))
        );

    if (
      this.route.snapshot.data['_id'] &&
      this.route.snapshot.data['_id'].code === 200
    ) {
      this.booksState.push(this.route.snapshot.data['_id'].data.result);
      this.createBook({ id: '0' }); // get fifo book
      this.openBook();
    }
  }

  createBook(option: any) {

    this.stateGroupSelected = true
    const index = Number(option.id.match(/\d+/)[0]),
      opt: Book = this.booksState[index];
    // console.log('opt', opt)
    if (opt) {
      if (opt.avatar && opt.avatar.file) {
        this.avatarFile = new ImageSnippet(opt.avatar.src, opt.avatar.file);
      }

      this.getHttp(opt.categoryId, 'category')
        .pipe(map((res: OptionEntry) => res.data.result))
        .subscribe((data: Category) => {
          if (data) {
            this.entranceForm.patchValue({
              categoryName: data.name
            });
          }
        });

      this.getHttp(opt.libraryId, 'library')
        .pipe(map((res: OptionEntry) => res.data.result))
        .subscribe((data: Library) => {
          if (data) {
            this.entranceForm.patchValue({
              libraryName: data.name
            });
          }
        });
      this.FormPatchValue(opt);
    }
  }

  private FormPatchValue(opt: Book) {
    this.entranceForm.patchValue(
      {
        title: opt.name,
        status: Number(opt.status),
        notes: opt.notes,
        _id: opt._id,
        SKU: opt.SKU,
        pages: opt.pages,
        bookcase: opt.bookcase && opt.bookcase._id ? {
          bid: opt.bookcase._id,
          whatnot: opt.bookcase.whatnot,
          bookshelf: opt.bookcase.bookshelf,
          bookshelfNo: opt.bookcase.bookshelfNo
        } : '',
        author: opt.author,
        publisher: opt.publisher,
        year: opt.year,
        volume: opt.volume,
        version: opt.version,
        isbn10: opt.isbn10,
        isbn13: opt.isbn13,
        dimensions: {
          x: opt.dimensions.x,
          y: opt.dimensions.y
        }
      }
    );
  }

  openBook(): void {
    this.entranceGate = !this.title.valid;

    const currBook: Book = this.booksState.find(o => o._id === this._id.value);

    // on open if not exist create one or use current. const obj2 = this.iFonts.find(o => o.name === this.iconCtrl.value);
    if (!this.entranceGate && currBook) {

      this.logger.log(`Άνοιγμα ${currBook.name}`, 1000);
      this.booksState = [];
      this.booksState.push(currBook); // refresh book state

      let p = [];
      for (let id in this.entranceForm.controls) {
        if (this.Formtranslator.hasOwnProperty(id)) {
          p.push({
            id,
            text: this.Formtranslator[id],
            value:
              id === 'status' && this.entranceForm.get(id).value
                ? 'Διαθέσιμο'
                : id === 'status' && !this.entranceForm.get(id).value
                  ? 'Μη Διαθέσιμο' : id === 'bookcase' ? this.entranceForm.get(id).value.whatnot + this.entranceForm.get(id).value.bookshelf + this.entranceForm.get(id).value.bookshelfNo
                    : id !== 'dimensions'
                      ? this.entranceForm.get(id).value
                      : this.entranceForm.get(id).get('x').value +
                      ' x ' +
                      this.entranceForm.get(id).get('y').value
          });
        }
      }
      this.stateData$ = this.invService.getData(p);
    }
  }

  editItem(): void {

    this.router.navigate(['/library/book/add', this._id.value])
  }

  private onChanges(): void {
    this.avatar.valueChanges.subscribe(file => {
      // console.log('addbookImageFile: ', file)
      if (file) {
        this.avatarFile.showPreviewPic(file);
      }
    });
  }

  private searchHttp(
    filteredValue: string,
    collectionName: string
  ): Observable<any> {
    return this.httpService.searchTasks(
      filteredValue.toLowerCase(),
      config.apiUrl +
      middlebar +
      'task' +
      middlebar +
      'library' +
      middlebar +
      'search',
      collectionName
    );
  }

  private getHttp(id: string, collectionName: string): Observable<any> {
    return this.httpService.getTasks(
      config.apiUrl +
      middlebar +
      'task' +
      middlebar +
      'library' +
      middlebar +
      'search' +
      middlebar +
      id,
      collectionName
    );
  }

  private _filterGroup(value: string, arr: string[]): StateGroup[] {
    const stateGroups = _AlphaBeticSort(arr);
    if (value) {
      return stateGroups
        .map(group => ({
          letter: group.letter,
          name: this._filter(group.name, value)
        }))
        .filter(group => group.name.length > 0);
    }

    return stateGroups;
  }

  private _filter(opt: string[], value: string): string[] {
    const filterValue = value.toLowerCase();

    return opt.filter(option => option.toLowerCase().includes(filterValue));
  }

  get _id() {
    return this.entranceForm.get('_id');
  }

  get SKU() {
    return this.entranceForm.get('SKU');
  }

  get title() {
    return this.entranceForm.get('title');
  }

  get pages() {
    return this.entranceForm.get('pages');
  }

  get avatar() {
    return this.entranceForm.get('avatar');
  }

  get status() {
    return this.entranceForm.get('status');
  }
  get notes() {
    return this.entranceForm.get('notes');
  }

  get categoryName() {
    return this.entranceForm.get('categoryName');
  }

  get libraryName() {
    return this.entranceForm.get('libraryName');
  }
}
