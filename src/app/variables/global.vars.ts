import { InventoryTabs, Category, Warehouse,
        TransferOrder, CycleCount, Receiving, Kit,
        IDropDownMenu,
        Item} from '../interfaces';

// Const values for URLs
// tslint:disable-next-line: one-variable-per-declaration
export let middlebar = '/',
            sprotocol = 'https',
            firstbar = '://',
            serHost = 'localhost',
            qport = ':',
            port = 8080;

export const WAREHOUSES_DATA: Warehouse[] = [
  {name: 'Store1', type: 'Store'},
  {name: 'Warehouse1', type: 'local'},
];

export const TRANSFORMORDER_DATA: TransferOrder[] = [
  {order_id: '34', source: 'Shop', destination: 'Store1',
    created: new Date('3-3-2003'), status: 'closed', creator: {name: 'John Doe'}
  },
];

export const CYCLECOUNT_DATA: CycleCount[] = [
  {cycleNo: 1030, created: new Date('2-3-2004'), warehouse: {name: 'Shop'},
  location: 1, status: 'saved', creator: {name: 'John Doe'} },
];

const f = '//a.scdn.gr/images/sku_main_images/018206/18206417/medium_20190416164501_hp_255_g7_9125_4gb_1tb_no_os.jpeg';
const t = 'HP 255 G7 (9125/4GB/1TB/No OS)';
export const RECEIVING_DATA: Receiving[] = [
  {item: {photos: {title: t, main: `${f}`, alternatives: [] },
    name: 'Purple Fork', sku: 'pplfork', locationList: [1, 2, 3, 4], serial_s: null}, location: 1, quantity: 1},

];

export const KIT_DATA: Kit[] = [
  {photos: {title: t, main: f}, name: 'Purple Bundle', SKU: 'pplbundle',
  fullfillmentSKU: '', items: {count: 3}, tags: '', status: 'active'},
];

export const ITEM_DATA: Item[] = [
    {photos: {title: t, main: f}, name: 'Purple Spoon', sku: 'pplspoon', barcode: 1000001, location: [{id: 1}, {id: 2}],
      tags: ['Pointy'], distributors: ['Cutlery Direct'], state: {onhand: 110}, status: true, fullfillmentSKU: ''},
    ];

export const INVENTORY_DATA_TABS: InventoryTabs[] = [
    // inventory tabs
    {icon: 'style', name: 'Items', id: 'items'},
    {icon: 'layers', name: 'Kits', id: 'kits'},
    {icon: 'domain', name: 'Warehouses', id: 'warehouses'},
    {icon: 'compare_arrows', name: 'Transfer Orders', id: 'transferorders'},
    {icon: 'cached', name: 'Cycle Counts', id: 'cyclecounts'},
    {icon: 'arrow_right_alt', name: 'Receive', id: 'receive'},
    {icon: 'arrow_right_alt', name: 'Deduct', id: 'deduct'},
    {icon: 'brush', name: 'Wizard', id: 'wizard'},
];

export const ORDERS_DATA_TABS: InventoryTabs[] = [
  // orders tabs
  {icon:  'inbox', name: 'Processing', id: 'processing'},
  {icon:  'local_shipping', name: 'Shipped', id: 'shipped'},
  {icon:  'archive', name: 'Archived', id: 'archived'},
];

// input name, m-selector icon,
export const CATEGORIES: Category[] = [

    // {_id: '27.47M', name: 'Texas', icon: `icon-social-instagram`},
      // {_id: '20.27M', name: 'Mans assadui', icon: `icon-social-instagram`},
  /* { _id: '11', name: 'Women’s Clothing', icon: 'icon-social-instagram', status:
    children: [ { _id: '1231', name: 'Cl Dior', icon: 'fa fa-arrow-circle-o-up',
    children: [ { _id: '12', name: 'Men’s Clothing', icon: 'icon-social-instagram' }] }]  },
  { _id: '12', name: 'Men’s Clothing', icon: 'icon-social-instagram' }, */
  /* { _id: '13', name: 'Phones & Accessories', icon: 'fa fa-mobile' },
  { _id: '14', name: 'Computer, Office, Security', icon: 'fa fa-desktop' },
  { _id: '15', name: 'Consumer Electronics', icon: 'fa fa-laptop' },
  { _id: '16', name: 'Jewelry & Watches', icon: 'icon-social-instagram' },
  { _id: '17', name: 'Home & Garden, Appliance', icon: 'icon-social-instagram' },
  { _id: '18', name: 'Bags & Shoes', icon: 'icon-social-instagram' },
  { _id: '19', name: 'Toys, K_ids & Baby', icon: 'icon-social-instagram' },
  { _id: '20', name: 'Sports & Outdoors', icon: 'icon-social-instagram' },
  { _id: '21', name: 'Beauty & Health, Hair', icon: 'icon-social-instagram' },
  { _id: '22', name: 'Auto & Motorcycles', icon: 'icon-social-instagram' } */
];

export const MENUBTN_ITEM: IDropDownMenu[] = [
  {title: 'Sales velocity', desc: `This allows you to project each item's sales and
  inventory needs over a period of time based on recent sales history`, cmd: () => {} },
  {title: 'Build items', desc: `This tool will sort through any unconfigured sales
  channel listings that you've imported and will automatically build new items for each listing`, cmd: () => {} },
  {title: 'Link listings', desc: `This tool will sort through any unconfigured
  sales channel listings that you've imported and will automatically link them
  to catalog items with matching SKUs`, cmd: () => {} },
  {title: 'Listings', desc: `This allows you to see all of your imported listings
  for all of your sales channels, giving you a quick overview of all of your listings
  so that you can see which ones (if any) still need to be configured.`, cmd: () => {} },
  {title: 'Bulk edit', desc: `This tool allows you to easily edit basic information for
  all of your items at once, such as their names, SKUs, barcodes, cost and retail pricing,
  and inventory counts per location.`, cmd: () => {} },
  {title: 'Bulk reconciliation', desc: `This tool allows you to easily adjust
  inventory for multiple items. Simply select the reconciliation type (Increase,
  decrease, or set), the reason for the adjustment, and then add the items you wish to adjust`, cmd: () => {} },
  {title: 'History', desc: `This tool allows you to easily see recent inventory changes at a glance,
  and to export inventory change records into a CSV spreadsheet.`, cmd: () => {} },
  {title: 'Custom fields', desc: `This tool allows you to see any custom fields set up
  for your items at a glance. You can also import or export custom fields and information
  via CSV spreadsheets.`, cmd: () => {} },
];

export const ACTIONBTN_ITEMS: IDropDownMenu[] = [
  {title: 'Create purchase orders', desc: `This allows you to quickly create a new
   Purchase Order for selected items, separating orders for multiple distributors automatically.`, cmd: () => {} },
  {title: 'Create cycle counts', desc: `This allows you to quickly create a new Cycle Count
  for selected items, separating counts by location if needed.`, cmd: () => {} },
  {title: 'Delete items', desc: ` This will delete any items that you've selected, removing the item's
  quantities from your inventory and unlinking any listings that were connected to the items.`, cmd: () => {} },
  {title: 'Print summary', desc: `This allows you to print a simple inventory summary, breaking down data like
  the on-hand count and recently sold amounts for each selected item.`, cmd: () => {} },
];

/**
 * This menu contains a couple of tools that can help
 * quickly manage all of your processing orders
 */
export const MENUBTN_ORDER_PROCESS: IDropDownMenu[] = [
  {title: 'Inventory summary', desc: `This tool can show you an overview
   of your orders' inventory needs. If you have enough on hand
   of each item needed for the orders, that order will be marked
   as fulfillable. You can see a summary for a group of orders by selecting those orders first.`, cmd: () => {}},
  {title: 'Listings summary', desc: `This tool can show you at a glance which items are needed for your processing orders.
  You can see a summary for a group of orders by selecting those orders first.`, cmd: () => {}},
  {title: 'Metadata summary', desc: `This tool can show you an overview of your order items' option selections at a glance.
   You can see a summary for a group of orders by selecting those orders first.`, cmd: () => {}},
  {title: 'Order notes summary', desc: `This tool can show you an overview of your orders' customer notes. 
  You can see a summary for a group of orders by selecting those orders first.`, cmd: () => {}},
  {title: 'Scan packing slips', desc: `This tool can help you start
  a batch by scanning packing slips for the orders you would like to fulfill together.`, cmd: () => {}},
  {title: 'Capture payment', desc: `If you need to check out a local point-of-sales order,
  you can scan items to build the order and capture the payment with one simple tool.
  All you need is the payment information and the catalog items being ordered.`, cmd: () => {}},
];

/**
 * This menu contains a couple of tools that
 * can affect a selected order or group of orders:
 */
export const ACTIONBTN_ORDER_PROCESS: IDropDownMenu[] = [
  {title: 'Print packing slips', desc: `This will quickly print out packing slips for each of the selected orders.
  Each packing slip will detail the order information, such as the shipping and return address and the items ordered.
   The packing slip template can be customized in the store settings page.`, cmd: () => {}},
  {title: 'Print pick lists', desc: `This will quickly print out a pick list that
   details the items needed for each of the selected orders.`, cmd: () => {}},
  {title: 'Print grouped pick list', desc: `This will quickly print out a pick list that details
   the items needed for each of the selected orders, with the items to pick separated by order.`, cmd: () => {}},
  {title: 'Print invoices', desc: `This will quickly print out an invoice for each of the selected orders. 
  Each invoice will detail the order information,
  such as the shipping and return address and the items ordered,
  as well as the price per item and the total order costs.
  The invoice template can be customized in the store settings page.`, cmd: () => {}},
  {title: 'Print item barcodes', desc: `This tool allows you to quickly print out barcode labels for each item in the selected orders.
  This is handy if your items aren't barcoded when in your warehouse,
  but you'd like them to have labels when they reach their destination.`, cmd: () => {}},
  {title: 'Print address labels', desc: `This tool allows you to quickly print out labels with the names and addresses
  that each of the selected orders are being shipped out to.
  This is handy for organizing a multi-step shipping process.`, cmd: () => {}},
  {title: 'Ship orders', desc: `This tool allows you to quickly create shipments and print shipping labels for the selected orders.
  Any memorized or rule-based shipment settings will automatically be applied.
  All you need to do is double-check the configurations, and edit any that are incomplete, before shipping.`, cmd: () => {}},
  {title: 'Combine orders', desc: `This tool allows you to combine selected orders under a chosen parent order.
  Use this when the same customer places multiple orders to be shipped to the same address.`, cmd: () => {}},
  {title: 'Start batch', desc: `This will quickly start a batch made up of the selected orders.`, cmd: () => {}},
  {title: 'Create purchase orders', desc: `This tool allows you to quickly create a new Purchase Order for the selected orders,
  separating purchase orders for multiple distributors automatically.`, cmd: () => {}},
  {title: 'E-mail customers', desc: `This tool allows you to quickly send an e-mail to the customers that placed the selected orders.
  Some templated e-mail options include shipment notifications, backorder alerts, and partial shipment updates.`, cmd: () => {}},
  {title: 'Bulk status change', desc: `This will quickly change the fulfillment status
  for the selected orders to the status of your choice.`, cmd: () => {}},
  {title: 'Bulk mark as shipped', desc: `This will quickly mark the selected orders as shipped and submit
  that change to their respective sales channels.`, cmd: () => {}},
  {title: 'Bulk inventory deduction', desc: `This will quickly deduct the inventory for the items in the selected orders.
  This is handy if those orders are being fulfilled through an external method.`, cmd: () => {}},
  {title: 'Bulk delete orders', desc: `This will quickly delete the selected orders,
  releasing the items from being reserved in inventory.
  Note that only manual orders will be permanently deleted;
  SKULabs can not delete or modify orders placed in your sales channels,
  so those orders will return in SKULabs on the next order sync.`, cmd: () => {}},
];
