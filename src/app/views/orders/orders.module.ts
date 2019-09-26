import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MaterialsModule, NgBootstrapModule } from 'src/app/modules';
import { OrdersRoutingModule, routedComponents } from './orders.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
    declarations: [ routedComponents.others ],
    imports: [ CommonModule, FormsModule, ReactiveFormsModule,
         HttpClientModule, MaterialsModule, OrdersRoutingModule, NgBootstrapModule ],
    exports: [],
    providers: [],
    schemas: []
})
export class OrdersModule {}
