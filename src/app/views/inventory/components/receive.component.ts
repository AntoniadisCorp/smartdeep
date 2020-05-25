import { Component, OnInit, ViewChild } from '@angular/core';

import { InventoryTableColumns, Receiving } from '../../../interfaces';
import { SelectionModel } from '@angular/cdk/collections';
import { RECEIVING_DATA } from '../../../variables';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-inventory-receive',
    templateUrl: './receive.component.html',
    styles: [`
        .card-toolbar .card-toolbar-action {
            float: right;
        }

        .example-container {
            display: flex;
            flex-direction: column;
        }

        .example-container > * {
            width: 100%;
        }
    `]
})
export class ReceiveComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    displayedColumns: string[] = ['itemImg', 'item', 'location', 'quantity', 'actions'];
    dataSource = new MatTableDataSource<Receiving>(RECEIVING_DATA);
    selection = new SelectionModel<Receiving>(true, []);
    btnCheckboxCol: InventoryTableColumns[];
    btnScanListen: boolean;

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

        this.btnScanListen = false;
    }

    startScanning(): void {
        this.btnScanListen = !this.btnScanListen;
    }

    // Apply Filtering/search on Table
    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }
}
