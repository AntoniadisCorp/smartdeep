import { Component, OnInit, ElementRef, ViewChild, Inject, ChangeDetectionStrategy, Injectable, AfterViewInit } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { Item, Category, OptionEntry, BodyObj, Iconfonts, IDropDownMenu, InventoryTableColumns } from '../../../../interfaces';
import { SmartEngineService, Logger } from '../../../../services';
import { ActivatedRoute, Router } from '@angular/router';
import { middlebar, config, MENUBTN_ITEM, GRLETTERS } from '../../../../variables';
import { Observable, of, merge, fromEvent, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, catchError, map, tap, debounceTime, startWith, switchMap } from 'rxjs/operators';
import { openMatDialog, addObjAttr, saveByHttpwithProgress, toResponseBody, uploadProgress } from '../../../../routines';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { FlatTreeControl } from '@angular/cdk/tree';
import { _fonts } from '../../../../datafiles';
import { DeleteitemListDialogConfirm } from '../../../../views/smartengine/components';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { MatAutocomplete } from '@angular/material/autocomplete';

@Component({
    selector: 'app-library-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryThemeComponent implements OnInit {


    @ViewChild('search', { static: false }) search: ElementRef;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    displayedColumns: string[] = ['_id',
        'name', 'icon', 'tree', 'root', 'desc', 'disabled', 'date_added', 'date_modified',
        'operations'];


    selection = new SelectionModel<Category>(true, [])

    data: any;
    resultsLength: any;
    progressActionDataBar: number;
    protected isRateLimitReached: boolean = false;
    isLoadingResults: boolean = true
    protected extraFilters: Array<{ [x: string]: any }>
    private tableAction: boolean = false
    private apiUrl: { searchUrl: string, deleteUrl: (col: string, id: string | number) => string, deleteManyUrl: string };


    MenuTools: IDropDownMenu[];
    btnCheckboxCol: InventoryTableColumns[];
    menuOperation: boolean = false
    clearMenu: boolean = true

    // Filter list
    selectable: boolean = true
    removable: boolean = true
    filters: { id: number, name: string }[] = []
    allFilters: string[] = ['Α', 'Β', 'Γ', 'Δ', 'Ε', 'ς'];

    sortLetters = GRLETTERS
    // private libSpace: any[];

    constructor(/* private router: Router, */
        private route: ActivatedRoute,
        private httpService: SmartEngineService,
        private logger: Logger,
        private dialog: MatDialog) { }

    ngOnInit(): void {



        // init API URL for CRUD ACTIVITIES
        this.apiUrl = {
            searchUrl: `${config.apiUrl}${middlebar}task${middlebar}library${middlebar}space${middlebar}category${middlebar}search`,
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
    // ------------------------ Οn Table Init ----------------------------
    private VarInitialization(): void {

        const routeSnapId: string | null = this.route.snapshot.paramMap.get('id')
        this.extraFilters = []

        this.MenuTools = MENUBTN_ITEM;
    }

    private addCategoryModal(editRowData?: Category): void {

        let data = {

            title: `Προσθήκη Θεματολογίας χώρου`,
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

        openMatDialog(this.dialog, data, AddCategoryDialogComponent, width)
            .afterClosed()
            .subscribe((result: any) => {
                console.log('The dialog was closed', result);
                if (!result) return
                this.clearSearch()
                this.progressActionDataBar = 0
            });

    }

    // ------------------------ Οn Table Load ----------------------------
    protected loadPage(): Observable<OptionEntry[]> { // protected functions
        // this.sort.sortables.forEach( (v,k) => console.log(v, k))

        return this.httpService.find(
            '',
            this.search.nativeElement.value.trim().toLowerCase(),
            this.sort.direction,
            this.paginator.pageIndex + 1,
            this.paginator.pageSize,
            'category',
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
        this.addCategoryModal()
    }

    editRow(Row: Category): void {

        this.tableAction = true

        const RowData: Category = {
            _id: Row._id,
            name: Row.name,
            slug: Row.slug,
            root: Row.root,
            desc: Row.desc,
            tree: Row.tree,
            icon: Row.icon,
            parentId: Row.parentId,
            date_added: Row.date_added,
            date_modified: Row.date_modified,
            disabled: Row.disabled
        }


        this.addCategoryModal(RowData)
    }

    deleteRow(Row: Category): void {

        this.tableAction = true

        let data = {
            title: `Διαγραφή Θεματολογίας`,
            subtitle: `Τίτλος ${Row.name}`,
            image: {
                icon: '',
                color: 'alert',
                svg: 'bookshelfNo'
            },
            text: `Είστε σίγουροι ότι θέλετε να διαγραφή η Θεματολογία;`,
            action: 'Διαγραφή',
            status: false
        },
            width = '400px';

        openMatDialog(this.dialog, data, DeleteitemListDialogConfirm, width)
            .afterClosed()
            .subscribe((result: any) => {
                console.log('The dialog was closed', result);

                if (result && Row._id)
                    this.httpService.deleteOneTask(this.apiUrl.deleteUrl('category', Row._id))
                        .subscribe((res) => { console.log('deleteOneTask: ', res), this.clearSearch() })
            });
    }

    // ------------------------ On Table Filtering -----------------------------
    // remove filter
    remove(id: number) {
        // this.removeElement(this.shelves, this.getBookShelves(shelf))

        if (id < 1) return

        const index: number = this.filters.findIndex((v) => v.id == id)

        if (index > -1) this.filters.splice(index, 1)


        // pushh to AllShelves
        // this.allShelves.push(shelf)
        // globalSort(this.allShelves)
    }

    filterByLetter(letter: { id: number, name: string }) {

        if (letter.id < 1) return

        // double push
        const index: number = this.filters.findIndex((v) => v.id == letter.id)


        if (letter.id > 0 && index < 0) {
            this.filters.push({ id: letter.id, name: letter.name })
        }

    }

    // ------------------------ On Table Selections ----------------------------
    // Toogle selectors
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.data ? this.data.length : 0;
        return numSelected === numRows;
    }

    // Toogle selectors
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {

        this.isAllSelected() ? this.selection.clear() :
            this.data.forEach((row: Category) => this.selection.select(row))

        // toggleButton
        this.menuOperation = this.selection.hasValue()

    }

    slaveToggle(row: Category) {

        this.selection.toggle(row)

        // toggleButton
        this.menuOperation = this.selection.hasValue()
    }

    // Toogle selectors Labels
    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Category): string {
        if (!row) {
            return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'
            } row ${row.name + 1}`;
    }

    // Toggle Table Columns
    setTableColumns(item?: InventoryTableColumns): void {

        const colindex = this.displayedColumns.indexOf('select', 0);
        const colExistance = colindex > -1;

        this.clearMenu = !this.clearMenu

        // console.log(colExistance);
        if (!colExistance) {
            this.displayedColumns.unshift('select')
        } else if (colExistance) {
            this.displayedColumns.shift()
            this.selection.clear()
            this.menuOperation = false
        }
    }

    // ------------------------ On Clear Search Table ----------------------------
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
}


/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
interface ItemNode {
    _id?: string
    name: string;
    slug?: string;
    children?: ItemNode[];
}


/** Flat to-do item node with expandable and level information */
export class ItemFlatNode {
    name: string;
    level: number;
    expandable: boolean;
    // checked?: boolean;
}

/* const TREE_DATA: ItemNode[] = [
    {
        name: 'Fruit',
        children: [
            { name: 'Apple' },
            { name: 'Banana' },
            { name: 'Fruit loops' },
        ]
    }, {
        name: 'Vegetables',
        children: [
            {
                name: 'Green',
                children: [
                    { name: 'Broccoli' },
                    { name: 'Marouli' },
                    { name: 'Marouli2' },
                ]
            }, {
                name: 'Orange',
                children: [
                    { name: 'Pumpkins' },
                    { name: 'Carrots' },
                ]
            },
            {
                name: 'Brown',
                children: [
                    { name: 'Bruce' },
                ]
            },
        ]
    },
]; */

/**
 * Checklist database, it can build a tree structured Json object.
 * Each node in Json object represents a to-do item or a category.
 * If a node is a category, it has children items and new items can be added under the category.
 */
@Injectable()
export class ChecklistDatabase {
    dataChange = new BehaviorSubject<ItemNode[]>([]);

    get data(): ItemNode[] { return this.dataChange.value; }

    constructor(private httpService: SmartEngineService) {
        this.initialize();
    }

    initialize(): void {
        // Build the tree nodes from Json object. The result is a list of `ItemNode` with nested
        //     file node as children.
        // const data = this.buildFileTree(TREE_DATA, 0);

        // Notify the change.
        const sUrl = config.apiUrl + middlebar + 'task' + middlebar + 'categories'
        this.gethttpData(sUrl)
    }

    /* private refreshData(): void {

        const sUrl = config.apiUrl + middlebar + 'task' + middlebar + 'categories'
        this.gethttpData(sUrl)
    } */

    private gethttpData(url: string): void {

        // get Http Request call,
        this.httpService.getTasks(url)
            .pipe(
                map((res: OptionEntry) => res.data.result),
                tap((item: Category[]) =>
                    item.map(itemNode => ({
                        _id: itemNode._id,
                        slug: itemNode.slug,
                        name: itemNode.name,
                        children: itemNode.children
                    }))
                )
            )
            .subscribe((data: ItemNode[]) => {
                // console.log(data)
                this.dataChange.next(data);
            })
    }

    /**
     * Build the file structure tree. The `value` is the Json object, or a sub-tree of a Json object.
     * The return value is the list of `ItemNode`.
     */
    /* buildFileTree(obj: { [key: string]: any }, level: number): ItemNode[] {
        return Object.keys(obj).reduce<ItemNode[]>((accumulator, key) => {
            const value = obj[key];
            let node: ItemNode = { name: '' };
            node.name = key;

            if (value != null) {
                if (typeof value === 'object') {
                    node.children = this.buildFileTree(value, level + 1);
                } else {
                    node.name = value;
                }
            }

            return accumulator.concat(node);
        }, []);
    } */

    getItem(_id: string) {
        const sUrl = config.apiUrl +
            middlebar + 'task' +
            middlebar + 'library' +
            middlebar + 'categories' +
            middlebar + _id

        const collectionName = 'category'

        // get Http Request call,
        this.httpService.getTask(sUrl, collectionName)
            .pipe(map((res: OptionEntry) => res.data.result))
            .subscribe((data: any) => {
                console.log(data)
                this.dataChange.next(data);
            })
    }

    /** Add an item to to-do list */
    insertItem(parent: ItemNode, name: string) {
        if (parent.children) {
            parent.children.push({ name } as ItemNode);
        } else {
            parent.children = [{ name } as ItemNode];
        }

        this.dataChange.next(this.data);
    }

    removeItem(parent: ItemNode, name: string): boolean {

        let removed: boolean = false

        if (parent.children) {
            // const index = parent.children.indexOf({ name } as ItemNode)
            removed = { name } as ItemNode === parent.children.pop()
        }
        return removed
    }

    updateItem(node: ItemNode, name: string) {
        node.name = name;
        this.dataChange.next(this.data);
    }
}

/**
 * Add Category Dialog Component
 */

@Component({
    selector: 'app-library-addcategory-dialog',
    templateUrl: 'dialog/addcategory-dialog.component.html',
    styles: [`
    
        .bookcase .mat-form-field {
            width: 100%;
        }

        p {
            text-align: center;
            margin-bottom: 0rem;
        }

        .radio-group {
            display: inherit;
            /* flex-direction: column; */
            /* margin: 15px 0; */
        }
        
        .radio-button {
            margin: 5px;
        }

        .tree-invisible {
            display: none;
          }

        .mat-tree-parent {
            display: block;
            position: relative;
            overflow: auto;
            contain: strict;
            transform: translateZ(0);
            will-change: scroll-position;
            -webkit-overflow-scrolling: touch;
            height: 200px;
        }

        mat-tree.tree {
            contain: content;
            left: 0;
            top: 0;
            position: absolute;
        }

        .mat-tree-parent label {
            margin-bottom: auto;
        }
          
        .tree ul,
        .tree li {
            margin-top: 0;
            margin-bottom: 0;
            list-style-type: none;
        }
          
    
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [ChecklistDatabase]
})
export class AddCategoryDialogComponent {


    CategoryForm: FormGroup
    Categorytypes: Array<{ id: number, value: string }> = []

    /** Map from flat node to nested node. This helps us finding the nested node to be modified */
    flatNodeMap = new Map<ItemFlatNode, ItemNode>();

    /** Map from nested node to flattened node. This helps us to keep the same object for selection */
    nestedNodeMap = new Map<ItemNode, ItemFlatNode>();

    /** A selected parent node to be inserted */
    // selectedParent: ItemFlatNode | null = null;

    /** The new item's name */
    // newItemName = '';

    treeControl: FlatTreeControl<ItemFlatNode>;

    treeFlattener: MatTreeFlattener<ItemNode, ItemFlatNode>;

    dataSource: MatTreeFlatDataSource<ItemNode, ItemFlatNode>;

    /** The selection for checklist */
    checklistSelection = new SelectionModel<ItemFlatNode>(false /* multiple */);

    @ViewChild('autoIcon', { static: false }) autoIcon: MatAutocomplete;
    // @ViewChild('itemValue', { static: false }) itemValue: ElementRef;

    progressActionDataBar: number = 0;
    iFonts: Array<Iconfonts> = [];
    filteredFonts: Observable<Iconfonts[]>;


    constructor(
        public dialogRef: MatDialogRef<AddCategoryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private httpService: SmartEngineService,
        private _database: ChecklistDatabase) {


        // Create Radio Button
        this.Categorytypes.push({ id: 0, value: 'Κατηγορία' }, { id: 1, value: 'Υποκατηγορία' })

        // Create Category Form
        this.CategoryForm = this.formBuilder.group({
            name: ['', [Validators.required, Validators.pattern('[ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9 _-]{1,50}')]],
            desc: ['', [Validators.maxLength(150), Validators.pattern('([ά-ώΆ-Ώα-ωΑ-Ωa-zA-Z0-9 \.\,\!\(\)\?\;\:\»\«_-]*(\r)?(\n)?)*')]],
            icon: [null],
            tree: [[]],
            root: [0, [Validators.required]],
            // LibtypesCntr: ['', [Validators.required, Validators.pattern('[0-9]{1,10}')]],
            date_added: new FormControl(new Date()),
            date_modified: new FormControl(''),
            disabled: new FormControl(false, Validators.required),
        })

        // Create Tree Node Controller and Data Source
        this.treeFlattener = new MatTreeFlattener(this.transformer, this.getLevel, this.isExpandable, this.getChildren);
        this.treeControl = new FlatTreeControl<ItemFlatNode>(this.getLevel, this.isExpandable);
        this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

        _database.dataChange.subscribe(data => {
            this.dataSource.data = data
            // console.log(data)
            if (this.data.body)
                this.treeInitialization()
        })

        if (this.data.body) this.OnInit()



        this.iFonts = _fonts;

        // Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        if (this.icon)
            this.filteredFonts = this.icon.valueChanges.pipe(
                startWith(''),
                map(state => state ? this._filterStatesFonts(state) : this.iFonts.slice())
            )
    }

    private treeInitialization(): void {

        const RowData: Category = this.data.body
        let node: ItemNode = { name: RowData.name, _id: RowData._id, slug: RowData.slug }

        if (!RowData.tree)
            return
        // get Flatted Node
        const fnode: ItemFlatNode = this.transformer(node, RowData.tree.length)

        // get Parent of Checked Node
        const parentNode: ItemFlatNode | null = this.getParentNode(fnode)

        if (!parentNode)
            return

        // Select Parent
        this.checklistSelection.select(parentNode)

        // Expand All Parents
        this.expandAllParentsSelection(parentNode)
    }

    private OnInit(): void {

        // On Edit Window set editable Row Values
        const RowData: Category = this.data.body
        // this._database.getItem(this.data.body._id)
        this.CategoryForm.setValue({
            name: RowData.name && RowData.name.length ? RowData.name : '',
            root: RowData.root !== undefined && RowData.root ? 0 : 1,
            tree: RowData.tree && RowData.tree.length ? RowData.tree : [],
            icon: RowData.icon ? RowData.icon.slice(_fonts[0].iconclass.length) : '',
            desc: RowData.desc && RowData.desc.length ? RowData.desc : '',
            date_added: (RowData.date_added ? RowData.date_added : ''),
            date_modified: (RowData.date_modified ? RowData.date_modified : ''),
            disabled: (RowData.disabled !== null ? !RowData.disabled : false),
        })

        // RowData.tree
        // RowData.slug
        // RowData._id
        // RowData.parentId

        /* const node: ItemFlatNode = this.transformer({
            name: this.data.body.name,
            slug: this.data.body.slug,
            _id: this.data.body._id
        }, this.data.body.tree.length)
 */
    }

    getLevel = (node: ItemFlatNode) => node.level;

    isExpandable = (node: ItemFlatNode) => node.expandable;

    getChildren = (node: ItemNode): ItemNode[] => node.children;

    hasChild = (_: number, _nodeData: ItemFlatNode) => _nodeData.expandable;

    hasNoContent = (_: number, _nodeData: ItemFlatNode) => this.name.valid && _nodeData.name === this.name.value

    onNoClick(): void {
        this.dialogRef.close();
    }

    onSave(): void {

        // Set URL
        const sUrl: string = config.apiUrl + middlebar + 'task' +
            middlebar + 'library' + middlebar + 'category' + middlebar + (this.data.body ? 'update' : 'save')



        const obj2 = this.iFonts.find(o => o.name === this.icon.value);
        const root: boolean = this.root.value > 0 ? false : true
        if (root) this.checklistSelection.clear()

        // Map flat Node to item Node Data for ParentId
        const itemflatNode: ItemFlatNode = this.checklistSelection.hasValue() ? this.checklistSelection.selected[0] : null
        const itemNode = this.flatNodeMap.get(itemflatNode);
        const newParentId = (!root && itemNode && itemNode._id ? itemNode._id : null)
        const parentId = this.data.body ? (this.data.body.parentId !== newParentId ? newParentId : undefined) : newParentId



        const category: Category = {
            name: this.name.value,
            slug: this.data.body ? this.data.body.slug : this.name.value.trim().toLowerCase(),
            icon: obj2 ? `${obj2.iconclass}${this.icon.value}` : '',
            parentId,
            root,
            desc: this.desc.value,
            date_added: this.data.body ? new Date(this.date_added.value) : new Date(),
            date_modified: this.data.body ? new Date() : null,
            disabled: this.data.body ? !this.disabled.value : false,
        }

        // console.log(category)


        // save Category new data via Http
        this.saveCategory(sUrl, category)
    }

    private saveCategory(sUrl: string, category: Category): void {

        // this.data.body ? edit mode
        const _id: string = this.data.body ? this.data.body._id : null

        let result = {
            category,
            editable: this.data.body ? true : false,
        }

        // contain _id to run Mongo db method as update function
        if (result.editable) addObjAttr(result.category, '_id', _id)
        if (!result.editable) addObjAttr(result.category, 'recyclebin', false)


        console.log('result: ', result)
        const dialogObj: BodyObj = {
            col: 'category',
            data: result.category,
        }
        // if (!result.editable) addObjAttr(dialogObj, 'uniqueId', [{ 'whatnot': addspace.whatnot }])

        // save data to DB
        this.saveByHttpWithProgress(dialogObj, sUrl)
            .subscribe((res: OptionEntry) => {

                // Close Dialog Box
                this.progressActionDataBar = 0
                if (res && res.code == 200) this.dialogRef.close(res.code)
                else {

                    console.error(res.error.status)
                }


            }, (error: any) => {
                console.log(error)
            })

    }

    private saveByHttpWithProgress(formData: any, URL: string): Observable<OptionEntry> {
        return this.httpService.saveTaskswithProgress(formData, URL)
            .pipe(
                uploadProgress((progress: number) => (this.progressActionDataBar = progress)),
                toResponseBody(),
                debounceTime(500),
                tap((result) => {
                    console.log('Saved results -->', result);

                    return result;
                }),
                catchError(this.httpService.handleError<any>('saveByHttpwithProgress'))
            );
    }

    /** Select the category so we can insert the new item. */
    addNewItem(node: ItemFlatNode) {

        if (!this.name.valid) return

        // Map flat Node to item Node Data 
        const parentNode = this.flatNodeMap.get(node);



        // if new item added in list the remove it
        // if (this.itemValue && this.itemValue.nativeElement.value === this.name.value.trim()) this.remItem(node)

        // Cache Insert data to Database
        // else this._database.insertItem(parentNode!, this.name.value);

        // refresh treeController
        const parent = this.getParentNode(node);
        if (parent)
            this.treeControl.collapse(parent),
                this.treeControl.expand(parent);

        // expand tree chevron_right of node
        this.treeControl.expand(node);

        // console.log(parentNode, this.itemValue)
        // if (this.itemValue) this.itemValue.nativeElement.value = this.name.value.trim()
    }


    remItem(node: ItemFlatNode) {

        // Get Json Data of parent of node 
        const parentNode = this.flatNodeMap.get(node);

        // Cache Insert data to Database
        if (this._database.removeItem(parentNode!, this.name.value))
            console.log('removed')

        // refresh treeController
        const parent = this.getParentNode(node);
        if (parent)
            this.treeControl.collapse(parent),
                this.treeControl.expand(parent);

        // expand tree chevron_right of node
        this.treeControl.collapse(node);

    }

    /** Save the node to database */
    saveNode(node: ItemFlatNode, itemValue: string) {
        const nestedNode = this.flatNodeMap.get(node);
        this._database.updateItem(nestedNode!, itemValue);
    }

    /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: ItemFlatNode): boolean {
        /* const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.every(child =>
            this.checklistSelection.isSelected(child)
        ); */
        return false; // descAllSelected
    }

    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: ItemFlatNode): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));
        return result && !this.descendantsAllSelected(node);
    }

    /** Toggle the to-do item selection. Select/deselect all the descendants node */
    todoItemSelectionToggle(node: ItemFlatNode): void {
        this.checklistSelection.toggle(node);
        // console.log(this.checklistSelection.selected, node)
        // const descendants = this.treeControl.getDescendants(node);
        /* this.checklistSelection.isSelected(node)
            ? this.checklistSelection.select(...descendants)
            : this.checklistSelection.deselect(...descendants); */

        // Force update for the parent
        /* descendants.every(child =>
            this.checklistSelection.isSelected(child)
        ); */
        // this.checkAllParentsSelection(node);
    }

    todoUncheckLeafItemSelection(node: ItemFlatNode): boolean {

        return this.checklistSelection.isSelected(node)
    }

    /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
    todoLeafItemSelectionToggle(node: ItemFlatNode): void {
        this.checklistSelection.toggle(node);
        // console.log(`todoLeafItemSelectionToggle:  ${this.checklistSelection.isSelected(node)}`, node)
        // this.checkAllParentsSelection(node);
    }

    /* Checks all the parents when a leaf node is selected/unselected */
    checkAllParentsSelection(node: ItemFlatNode): void {
        let parent: ItemFlatNode | null = this.getParentNode(node);
        // console.log(parent, this.checklistSelection)
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }

    /* Expand all the parents when a leaf node is selected/unselected */
    expandAllParentsSelection(node: ItemFlatNode): void {
        let parent: ItemFlatNode | null = this.getParentNode(node);

        while (parent) {
            if (parent.level < 1)
                this.expandRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }

    /** Check root node checked state and change it accordingly */
    checkRootNodeSelection(node: ItemFlatNode): void {
        const nodeSelected = this.checklistSelection.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        if (nodeSelected && !descAllSelected) {
            this.checklistSelection.deselect(node);
        } else if (!nodeSelected && descAllSelected) {
            this.checklistSelection.select(node);
        }
    }

    /** Check root node checked state and change it accordingly */
    expandRootNodeSelection(node: ItemFlatNode): void {
        // const nodeSelected = this.checklistSelection.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        this.treeControl.expand(node)
        descendants.every(child => {
            this.treeControl.expand(child); return true
        })
    }



    /* Get the parent node of a node */
    getParentNode(node: ItemFlatNode): ItemFlatNode | null {
        const currentLevel = this.getLevel(node);

        if (currentLevel < 1) {
            return null;
        }

        const index = this.treeControl.dataNodes.map(i => i.name).indexOf(node.name)
        const startIndex = index > -1 ? index - 1 : index

        for (let i = startIndex; i >= 0; i--) {
            const currentNode = this.treeControl.dataNodes[i];

            if (this.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }

    /**
     * Transformer to convert nested node to flat node. Record the nodes in maps for later use.
     */
    transformer = (node: ItemNode, level: number) => {
        const existingNode = this.nestedNodeMap.get(node);
        const flatNode = existingNode && existingNode.name === node.name
            ? existingNode
            : new ItemFlatNode();
        flatNode.name = node.name;
        flatNode.level = level;
        flatNode.expandable = !!node.children && !!node.children.length;
        // flatNode.checked = false
        this.flatNodeMap.set(flatNode, node);
        this.nestedNodeMap.set(node, flatNode);
        return flatNode;
    }

    get name() {
        return this.CategoryForm.get('name')
    }

    get slug() {
        return this.CategoryForm.get('slug')
    }

    get tree() {
        return this.CategoryForm.get('tree')
    }

    get root() {
        return this.CategoryForm.get('root')
    }

    get icon() {
        return this.CategoryForm.get('icon')
    }

    get desc() {
        return this.CategoryForm.get('desc')
    }

    get date_added() {
        return this.CategoryForm.get('date_added')
    }

    get date_modified() {
        return this.CategoryForm.get('date_modified')
    }

    get disabled() {
        return this.CategoryForm.get('disabled')
    }


    private _filterStatesFonts(value: string): Iconfonts[] {

        const filterValue = value.toLowerCase();
        return this.iFonts.filter(state => state.name.toLowerCase().indexOf(filterValue) === 0);
    }

    private _filterFontsIncludes(value: string): Iconfonts[] {
        const filterValue = value.toLowerCase()
        return this.iFonts
    }

}
