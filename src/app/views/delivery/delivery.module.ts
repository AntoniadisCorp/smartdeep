import { NgModule } from '@angular/core';

import { DeliveryRoutingModule, routedComponents } from './delivery.routing';
import { HttpClientModule } from '@angular/common/http';
import { MaterialsModule } from '../../modules';
import { CommonModule } from '@angular/common';
import { APP_ORDER_COMPONENT } from '../../components/app-components';




@NgModule({
    declarations: [ routedComponents, APP_ORDER_COMPONENT ],
    imports: [
        HttpClientModule,
        MaterialsModule,
        DeliveryRoutingModule, CommonModule ],
    providers: [],
    exports: [routedComponents, APP_ORDER_COMPONENT]
})
export class DeliveryModule {}
