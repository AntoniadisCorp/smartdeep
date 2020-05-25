import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MaterialsModule, NgBootstrapModule } from '../../modules';
import { InventoryRoutingModule, routedComponents } from './inventory.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [ routedComponents.app ],
    imports: [ CommonModule, FormsModule, ReactiveFormsModule,
         HttpClientModule, MaterialsModule, InventoryRoutingModule, NgBootstrapModule ],
    exports: [routedComponents.app],
    providers: [],
    schemas: []
})
export class InventoryModule {}
