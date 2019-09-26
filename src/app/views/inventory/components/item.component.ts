import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MENUBTN_ITEM, ACTIONBTN_ITEMS, ITEM_DATA } from 'src/app/variables';
import { InventoryTableColumns, Item, IDropDownMenu } from 'src/app/interfaces';

@Component({
    selector: 'app-inventory-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    displayedColumns: string[] = ['select', 'photos', 'name', 'sku', 'barcode',
        ]; // 'tags', 'distributors', 'fullfillmentSKU', 'onhand', 'status

    dataSource = new MatTableDataSource<Item>(ITEM_DATA);
    selection = new SelectionModel<Item>(true, []);
    btnCheckboxCol: InventoryTableColumns[];

    MenuTools: IDropDownMenu[];
    ActionBtn: IDropDownMenu[];

    constructor() { }

    ngOnInit(): void {

        this.MenuTools = MENUBTN_ITEM;
        this.ActionBtn = ACTIONBTN_ITEMS;

        // setup table paginator
        this.dataSource.paginator = this.paginator;
        // setup table sorting
        this.dataSource.sort = this.sort;

        // setup btn columns menu that will be displayed
        this.btnCheckboxCol = [];

        this.displayedColumns.forEach( (v, i) => {
            if (v === 'select') { return; } // stop processing this iteration

            this.btnCheckboxCol.push({
                checked: v.length > 0 && (this.displayedColumns.includes(v)),
                tbcolumn: v
            });
        });
    }

    // Toggle Table Columns
    setTableColumns(item: InventoryTableColumns): void {

        const colindex = this.displayedColumns.indexOf(item.tbcolumn, 0);
        const colExistance = colindex > -1;

        console.log( colExistance, item.checked);
        if (item.checked && !colExistance) {
            this.displayedColumns.push(item.tbcolumn);
        } else if (!item.checked && colExistance ) {
            this.displayedColumns.splice(colindex, 1);
        }
    }

    // Apply Filtering/search on Table

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    // Toogle selectors
    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    // Toogle selectors
    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    // Toogle selectors Labels
    /** The label for the checkbox on the passed row */
    checkboxLabel(row?: Item): string {
        if (!row) {
        return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
        }
        return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.name + 1}`;
    }
}
