import { NgModule } from '@angular/core';



import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule, MatCommonModule, MatNativeDateModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTreeModule } from '@angular/material/tree';
import { MatCardModule } from '@angular/material/card';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

import { MatProgressBarModule } from '@angular/material/progress-bar';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MatDividerModule } from '@angular/material/divider';

const MatVars = [MatButtonModule, MatIconModule, MatRippleModule, MatTabsModule, MatSortModule, MatToolbarModule, MatTableModule,
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
