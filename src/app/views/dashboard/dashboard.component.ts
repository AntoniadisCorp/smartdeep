import { Component, OnInit, ElementRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith, switchMap, debounceTime, tap, finalize } from 'rxjs/operators';
import { Category, Iconfonts, MenuAction, BodyObj } from '../../interfaces';
import { _fonts } from '../../datafiles';
import { SmartEngineService } from '../../services';
import { setServerUrl } from '../../routines';
import { middlebar } from '../../variables';
// isense.smartdeep.io
const apiUrl: string = setServerUrl('localhost', 8080) + middlebar + 'task'; // isense.azurewebsites.net, isense.smartdeep.io 443

console.log(apiUrl);

/* This is a component which we pass in modal*/
@Component({

  // tslint:disable-next-lines
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public value: string;
  public cateObj: Array<Category> = [];
  public searchCatObj: Array<Category> = [];
  public iFonts: Array<Iconfonts> = [];
  public catInput: Category;
  public iconCtrl = new FormControl();
  public cateCtrl = new FormControl();
  public filteredOptions: Observable<Iconfonts[]>;
  public ParentfilteredOption: Observable<Category[]>;

  isProcessing: boolean;
  refreshing: boolean;
  act: MenuAction;
  emptyText: string;

  constructor(private httpService: SmartEngineService, private modalService: BsModalService) { }

  ngOnInit() {

    this.VarsInit();

    this.refreshData(); // refresh category box

    // create filter controller by piping data
    this.ParentfilteredOption = this.cateCtrl.valueChanges.pipe(
      startWith(''),
      // delay emits
      debounceTime(300),
      tap(() => this.isProcessing = true),
      // use switch map so as to cancel previous subscribed events, before creating new ones
      switchMap(value => {
        if (value !== '') {
          // lookup from smartdeep isense
          return this.searchCtrl(value).pipe(finalize(() => this.isProcessing = false));
        } else {
          // if no value is present, return null
          return of(null);
        }
      }),
      tap(() => this.isProcessing = false),
      map(state => this.searchCatObj = state));
    /* map(state => state ? this._filterStates(state) : this.searchCatObj.slice()) */


    this.filteredOptions = this.iconCtrl.valueChanges.pipe(startWith(''),
      map(state => state ? this._filterStatesFonts(state) : this.iFonts.slice()));
  }

  private _filterStates(value: string): Category[] {

    const filterValue = value;
    /*       console.log('filter states: autocomplete ' + JSON.stringify(this.searchCatObj)) */
    return this.searchCatObj.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }

  private _filterStatesFonts(value: string): Iconfonts[] {

    const filterValue = value.toLowerCase();
    return this.iFonts.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
  }

  public reset(): void {

    this.value = '';
  }

  public edit() {

    this.act.status = !this.act.status;
    this.act.iconclass = !this.act.status ? 'trash' : 'plus';
  }

  public searchCtrl(filteredValue: string): Observable<any> {


    return this.httpService.searchTasks(filteredValue.toLowerCase(),
      apiUrl + middlebar + 'categories' + middlebar + 'search', 'category');
  }

  public openAction(): void {

    this.act.actionfun();
    this.refreshData();
  }

  private addCategory(): void {

    let localInput: BodyObj;

    // get object _id
    const obj = this.searchCatObj !== null ? this.searchCatObj.find(o => o.name === this.cateCtrl.value) : undefined;
    const obj2 = this.iFonts.find(o => o.name === this.iconCtrl.value);
    const parent_id = !obj ? '' : obj._id

    const datafly: Category = {
      name: this.catInput.name,
      icon: `${obj2.iconclass}${this.iconCtrl.value}`,
      parent_id: parent_id,
      top: parent_id && parent_id.length > 0 ? false : true,
      desc: '',
      status: true,
      date_added: new Date(),
      recyclebin: false
    }

    localInput = {
      data: datafly,
      col: 'category'
    };

    this.catInput = { name: '' };
    this.iconCtrl.setValue('');

    // post Http Request call
    this.httpService.saveTasks(localInput, apiUrl + middlebar + 'save')
      .subscribe((resp: any) => {
        console.log(resp && resp.code && resp.code === 200);
      });

  }

  private deleteCategory(): void {


    // post Http Request call
    this.httpService.deleteTasks(this.act.CategoryRemList, apiUrl + middlebar + 'del')
      .subscribe((resp: any) => {
        this.act.CategoryRemList = resp && resp.code && resp.code === 200 ? [] : this.act.CategoryRemList;
      });
  }

  public refreshData() {

    // category list initialize
    this.cateObj = [];
    this.refreshing = true;
    this.emptyText = 'loading...';

    // get Http Request call,
    this.httpService.getTasks(apiUrl + middlebar + 'categories')
      .subscribe((data: any) => {

        // before refresh data, refresh Html Category Box by className
        this.removeElementsByClass('categories');

        this.cateObj = data;
        this.refreshing = false;
        this.emptyText = '';
      });
  }

  public isEmpty(obj: any) {

    return !(obj && obj.length > 0);
  }

  private removeElementsByClass(className: string) {
    const elements = document.getElementsByClassName(className);
    while (elements.length > 0) { elements[0].parentNode.removeChild(elements[0]); }
  }

  /**
   * VarsInit
   */
  private VarsInit(): void {

    this.isProcessing = this.refreshing = false;
    this.emptyText = '';

    this.act = {
      status: true,
      iconclass: 'plus',
      CategoryRemList: [],
      actionfun: (): boolean => {

        !this.act.status ? this.deleteCategory() : this.addCategory();
        return true;
      }
    };


    this.value = '';
    this.catInput = { name: '', parent_id: '' };
    this.iFonts = _fonts;
  }
}
