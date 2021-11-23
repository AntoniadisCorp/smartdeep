import { NgModule } from '@angular/core';
import { ItemListComponent, DeleteitemListDialogConfirm } from '../views/smartengine/components';
import { CommonModule } from '@angular/common';
import { MaterialsModule } from './material.module';
import { FormsModule } from '@angular/forms';



@NgModule({
    imports: [CommonModule, MaterialsModule, FormsModule ],
    exports: [ItemListComponent, CommonModule, MaterialsModule, FormsModule],
    declarations: [ItemListComponent, DeleteitemListDialogConfirm],
    // entryComponents: [DeleteitemListDialogConfirm],
    providers: [],
})
export class ItemListModule { }
