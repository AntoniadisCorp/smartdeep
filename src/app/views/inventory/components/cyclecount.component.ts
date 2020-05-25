import { Component, OnInit, ViewChild } from '@angular/core';
import { InventoryTableColumns, CycleCount } from '../../../interfaces';
import { CYCLECOUNT_DATA } from '../../../variables';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-inventory-cyclecount',
    templateUrl: './cyclecount.component.html'
})
export class CycleCountComponent implements OnInit {

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    displayedColumns: string[] = ['cycleNo', 'created', 'warehouse',
                    'location', 'creator', 'status', 'actions'];
    dataSource = new MatTableDataSource<CycleCount>(CYCLECOUNT_DATA);
    selection = new SelectionModel<CycleCount>(true, []);
    btnCheckboxCol: InventoryTableColumns[];
    datePickerFrom: Date;
    value: string;

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
