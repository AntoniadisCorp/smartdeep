import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { TRANSFORMORDER_DATA } from 'src/app/variables';
import { TransferOrder, InventoryTableColumns } from 'src/app/interfaces';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
    selector: 'app-inventory-transferorder',
    templateUrl: './transferorder.component.html'
})
export class TransferOrderComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    displayedColumns: string[] = ['order_id', 'source', 'destination',
                    'created', 'creator', 'status', 'actions'];
    dataSource = new MatTableDataSource<TransferOrder>(TRANSFORMORDER_DATA);
    selection = new SelectionModel<TransferOrder>(true, []);
    btnCheckboxCol: InventoryTableColumns[];
    datePickerFrom: Date;

    constructor() { }

    ngOnInit(): void {
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

    // Apply Filtering/search on Table

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
