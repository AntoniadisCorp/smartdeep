import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MaterialsModule, NgBootstrapModule } from 'src/app/modules';
import { InventoryRoutingModule, routedComponents } from './inventory.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [ routedComponents.others ],
    imports: [ CommonModule, FormsModule, ReactiveFormsModule,
         HttpClientModule, MaterialsModule, InventoryRoutingModule, NgBootstrapModule ],
    exports: [],
    providers: [],
    schemas: []
})
export class InventoryModule {}
