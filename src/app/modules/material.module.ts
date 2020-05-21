import { NgModule } from '@angular/core';

import {
    MatButtonModule, MatIconModule, MatRippleModule, MatFormFieldModule,
    MatCommonModule, MatMenuModule, MatDividerModule, MatInputModule, MatAutocompleteModule,
    MatSlideToggleModule, MatProgressBarModule, MatProgressSpinnerModule, MatCheckboxModule, MatTabsModule,
    MatToolbarModule, MatTableModule, MatPaginatorModule, MatSortModule, MatTooltipModule, MatSelectModule,
    MatDatepickerModule, MatNativeDateModule, MatChipsModule, MatButtonToggleModule, MatSnackBarModule, MatDialogModule,
    MatListModule, MatGridListModule, MatRadioModule, MatCardModule, MatTreeModule
} from '@angular/material';

import { FlexLayoutModule } from '@angular/flex-layout';

const MatVars = [MatButtonModule , MatIconModule, MatRippleModule, MatTabsModule, MatSortModule, MatToolbarModule, MatTableModule,
    MatTooltipModule, MatCommonModule, MatMenuModule, MatDividerModule, MatInputModule, MatAutocompleteModule, MatPaginatorModule,
    MatFormFieldModule, MatSlideToggleModule, MatProgressBarModule, MatProgressSpinnerModule, MatCheckboxModule, MatSelectModule,
    MatNativeDateModule, MatDatepickerModule, MatChipsModule, MatButtonToggleModule, MatSnackBarModule, MatDialogModule,
    MatListModule, MatGridListModule, MatRadioModule, FlexLayoutModule, MatCardModule, MatTreeModule
];

@NgModule({
    imports: [...MatVars],
    exports: [...MatVars]
})
export class MaterialsModule { }
