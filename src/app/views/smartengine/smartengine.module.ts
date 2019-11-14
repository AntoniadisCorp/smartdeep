import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Start Routing Module */
import { EngineRoutingModule
    , routedComponents } from './smartengine.routing';

import { MaterialsModule, AppNgModules } from '../../modules';

import { ReDirective } from '../../directives';
import { APP_PRODUCT_CARD } from 'src/app/components';
import { FormsModule } from '@angular/forms';

const APP_DIRECTIVES = [
    ReDirective,
    APP_PRODUCT_CARD,
];

@NgModule({
    declarations: [

        routedComponents.others,
        ...APP_DIRECTIVES,
    ],
    imports: [
        AppNgModules,
        EngineRoutingModule,
        MaterialsModule,
        FormsModule,
    ],

    exports: [],
    providers: [],
})
export class SearchModule {};
