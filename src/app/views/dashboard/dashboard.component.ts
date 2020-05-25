import { Component, OnInit, ElementRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith, switchMap, debounceTime, tap, finalize } from 'rxjs/operators';
import { Category, Iconfonts, MenuAction, BodyObj } from '../../interfaces';
import { _fonts } from '../../datafiles';
import { SmartEngineService } from '../../services';
import { setServerUrl } from '../../routines';
import { middlebar, config } from '../../variables';
import { transition, animate, state, style, trigger } from '@angular/animations';
import { DropdownModule } from '../../modules';
// isense.smartdeep.io setServerUrl('localhost', 8080)
const apiUrl: string = config.apiUrl + middlebar + 'task'; // isense.azurewebsites.net, isense.smartdeep.io 443

console.log(apiUrl);

/* This is a component which we pass in modal*/
@Component({

  // tslint:disable-next-lines
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  animations: [
    trigger('toggleHeight', [
      state('hide', style({
        width: '0px',
        height: '0px',
        opacity: '0',
        overflow: 'hidden',
        // display: 'none'
      })),
      state('show', style({
        width: '*',
        height: '*',
        opacity: '1',
        // display: 'block'
      })),
      transition('hide => show', animate('200ms ease-in')),
      transition('show => hide', animate('200ms ease-out'))
    ])
  ],
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {


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
  menu: { edit: string }
  emptyText: string;
  isShowSettings: string;

  constructor(private httpService: SmartEngineService) { }

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
        if (value === '' || value.length < 2) {
          // if no value is present, return null
          return of(null);
        } else {
          // lookup from smartdeep isense
          return this.searchCtrl(value, 'category').pipe(finalize(() => this.isProcessing = false));
        }
      }),
      tap(() => this.isProcessing = false),
      map(state => this.searchCatObj = state));
    /* map(state => state ? this._filterStates(state) : this.searchCatObj.slice()) */


    this.filteredOptions = this.iconCtrl.valueChanges.pipe(
      startWith(''),
      map(state => state ? this._filterStatesFonts(state) : this.iFonts.slice())
    )
  }

  showSettings() {

    this.isShowSettings = (this.isShowSettings === 'show') ? 'hide' : 'show';
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


  public edit() {

    this.act.status = !this.act.status;
    this.menu.edit = !this.act.status ? 'close' : 'edit';
    this.act.iconclass = !this.act.status ? 'trash' : 'plus';
  }

  public searchCtrl(filteredValue: string, collectionName: string): Observable<any> {


    return this.httpService.searchTasks(filteredValue.toLowerCase(),
      apiUrl + middlebar + 'categories' + middlebar + 'search', collectionName);
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
    const parentId = !obj ? '' : obj._id;

    const data: Category = {
      slug: this.catInput.name.trim().toLowerCase(),
      name: this.catInput.name,
      icon: obj2 ? `${obj2.iconclass}${this.iconCtrl.value}` : '',
      parentId,
      root: parentId && parentId.length > 0 ? false : true,
      desc: '',
      date_added: new Date(),
      recyclebin: false
    };



    this.catInput = { name: '' };
    this.iconCtrl.setValue('');

    // post Http Request call
    this.httpService.saveTasks({ data, col: 'category' }, apiUrl + middlebar + 'category' + middlebar + 'save')
      .subscribe((resp: any) => {
        console.log(resp && resp.code && resp.code === 200);
      });

  }

  private deleteCategory(): void {


    // post Http Request call
    this.httpService.deleteTasks(this.act.CategoryRemList, apiUrl + middlebar + 'category' + middlebar + 'del', 'category')
      .subscribe((resp: any) => {
        this.act.CategoryRemList = resp && resp.code && resp.code === 200 ? [] : this.act.CategoryRemList;
      });
  }

  public refreshData() {

    // category list initialize
    this.cateObj = [];
    this.refreshing = true;
    this.emptyText = 'loading...';
    this.isShowSettings = 'hide';

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

    this.menu = {
      edit: 'edit'
    }

    this.catInput = { name: '', parentId: '' };
    this.iFonts = _fonts;
  }


}
