import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { DeliveryRoutingModule, routedComponents } from './delivery.routing';
import { HttpClientModule } from '@angular/common/http';
import { MaterialsModule } from 'src/app/modules';
import { CommonModule } from '@angular/common';
import { APP_ORDER_COMPONENT } from 'src/app/components/app-components';




@NgModule({
    declarations: [ routedComponents, APP_ORDER_COMPONENT ],
    imports: [
        HttpClientModule,
        MaterialsModule,
        DeliveryRoutingModule, CommonModule ],
    providers: []
})
export class DeliveryModule {}
