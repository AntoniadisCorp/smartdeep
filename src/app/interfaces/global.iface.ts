import { Observable } from 'rxjs';
import { ObjectID } from 'bson';

export interface IBreadcrumb {
  label: string;
  params: any;
  url: string;
}

export interface StateGroup {
  letter: string;
  name: string[];
}

export interface OptionEntry {

  code: number;
  status: string;
  data?: EntryData | any;
  error?: any;
}

export interface EntryData {

  result?: Array<any>
  message?: string
}

export interface DataSource {
  displayValue: (value: any) => Observable<OptionEntry | null>;
  search: (term: string) => Observable<OptionEntry[]>;
  match?: (search: string, entry: OptionEntry) => boolean;
}

export interface DataCRUD {

  displayValue: () => Observable<OptionEntry | null>;
  CRUDFunc: (apiUrl: string) => Observable<any[]>;
}

export interface Tasks {
  _id: string;
  title: string;
  details: {
    icon: string,
    storeName: string,
    storeAdress: string,
    shipping: string,
    stars: number,
    orders: number,
  };
  isDone: boolean;
}

export interface Category {
  _id?: string;
  name: string;
  slug?: string;
  icon?: string;
  children?: Array<Category>;
  parentId?: string;
  desc?: string;
  root?: boolean;
  tree?: Array<{ _id: string, name: string, slug: string }>
  action?: MenuAction;
  date_added?: Date;
  date_modified?: Date;
  disabled?: boolean;
  recyclebin?: boolean;
}

export interface Library {
  _id?: string;
  name: string;
  books?: number;
  bookcases?: string[];
  icon?: string;
  imageUrl?: string;
  date_added?: Date;
  date_modified?: Date;
  recyclebin?: boolean;
  status?: string;
}


export interface LibrarySpace {

  _id?: string;
  whatnot: string;
  type: number;
  bookshelves: BookShelf[];
  date_added: Date;
  date_modified?: Date;
  disabled: boolean;
  status?: string;
  recyclebin?: boolean;
}

export interface BookShelf {
  name: string,
  used: boolean
}

export interface BookCase {
  _id?: string;
  skuid: string;
  name: string;
  type: number;
  whatnot: string;
  bookshelf: string;
  categories?: Array<{ _id: string | ObjectID, name: string }>
  books?: {
    count: number,
    arrIndex: Array<{ _id: string, bookshelfNo: number }>
  }
  desc: string,
  date_added?: Date;
  date_modified?: Date;
  imageUrl?: string;
  disabled: boolean;
  recyclebin?: boolean;
}

export interface BodyObj {

  data: Library | Category | any; // body data, it is json OBJECT
  dataPlus?: BodyObj['data']
  col: string; // collection
}

export interface Iconfonts {
  iconclass: string;
  link: string;
  name: string;
  type: string;
}

export interface MenuAction {

  status: boolean;
  iconclass: string;
  CategoryRemList: string[];
  actionfun?: () => boolean;
}

export interface RESTfulServ {

  code: number;
  message: string;
  status: string;
}

export interface ObjectId {
  '$oid': string
}

export interface DlvryFilters {

  Title: string;
  Action: string;
  groupHeader: {
    title: string;
    action: string;
    icon: string;
  };
  groupList: [{
    icon: string;
    href: string;
    count: number;
    status: string; // selected or not
  }];
  groupForm: {
    inputCount: number;
    btnAction: string;
    icon: string;
  };
}

export interface MainPageTabIndex {

  OrderClass: {
    active: boolean;
  };

  DeliveryClass: {
    active: boolean;
  };
}

export interface InventoryTabs {
  svg?: string;
  icon: string;
  name: string;
  id: string;
}

export interface InventoryTableColumns {
  tbcolumn: string;
  checked: boolean;
}

export interface IDropDownMenu {

  title: string;
  desc: string;
  cmd: () => void;
}

export interface ItoggleListMenu {
  id: number;
  value: string;
  icon: string;
  uRL: string;
}


export interface Item {

  _id?: string;
  name: string;
  photos: {
    title?: string;
    main: string;
    alternatives?: Array<string>;
  };
  sku: string;
  barcode: number;
  location: {
    id: number;
    warehouse?: Warehouse;
  }[];
  tags: string[];
  distributors: string[];
  fullfillmentSKU: string;
  fba?: number;
  inbound_fba?: number;
  alert?: number; // level is a threshold to be notified of a low inventory count
  state: {
    onhand: number; // in stock that may be reserved open orders as well as the remaining stock that is free for purchase
    reserved?: number; //
    free?: number;
    incoming?: number;
    sold?: number;
  };
  status: boolean;
  mover?: string[]; // rating;
  /* The mover rating is a ranking of each item in your inventory based on recent sales volume.
   "A" movers are your top 20% of items sold recently, while "B" items are your next 60%, and
    "C" items are your bottom 20%. */
  lastcounted?: CycleCount; /* This indicates when this item was last counted as part of a cycle count.
  This will be empty if the item has never been included in any cycle counts before. */
}



export interface Warehouse {

  name: string;
  type: string;
  address?: {
    _id: string;
    name: string;
    formatted_address: string;
    gooapiFPFT: GoogleApiFindPlaceFromText[];
  };
}

export interface TransferOrder {

  _id?: string;
  order_id: string;
  status: string;
  source: string;
  destination: string;
  created: Date;
  modified?: Date;
  creator?: {
    _id?: string;
    name: string;
    alternative?: Array<string>;
  };
}

export interface CycleCount {

  _id?: string;
  cycleNo: number;
  created: Date;
  warehouse: {
    _id?: string;
    name: string;
  };
  creator?: {
    _id?: string;
    name: string;
    alternative?: Array<string>;
  };
  location: number;
  status: string; // saved started, processing
}

export interface Receiving {
  item: {
    photos: {
      title: string,
      main: string,
      alternatives: Array<string>;
    }
    name: string;
    sku: string;
    locationList: Array<number>;
    serial_s: Array<number>;
  };
  location: number;
  quantity: number;
}

export interface Kit {

  _id?: string;
  name: string;
  photos: {
    title: string;
    main: string;
    alternatives?: Array<string>;
  };
  SKU: string;
  fullfillmentSKU: string;
  items: {
    count: number;
  };
  tags: any;
  status: string;
}

export class RandomNumber {
  value!: number;
}

export class Tokens {
  jwt!: string;
  refreshToken!: string;
  userId?: string;
}

export interface GoogleApiFindPlaceFromText {
  'geometry': {
    'location': {
      'lat': number;
      'lng': number;
    },
  };
  'opening_hours': {
    'open_now': false,
    'weekday_text': []
  };
  'photos': [
    {
      'height': number,
      'html_attributions': string[];
      'photo_reference': string;
      'width': number;
    }
  ];
  'place_id': string;
  'types': Array<string>;
  'vicinity': string;
  'rating': number;
}

