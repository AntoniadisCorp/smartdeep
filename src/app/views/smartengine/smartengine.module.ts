import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Start Routing Module */
import { EngineRoutingModule
    , routedComponents } from './smartengine.routing';

import { MaterialsModule, AppNgModules, ItemListModule } from '../../modules';

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
        routedComponents.entry,
        ...APP_DIRECTIVES,
    ],
    imports: [
        AppNgModules,
        EngineRoutingModule,
        MaterialsModule,
        FormsModule,
        ItemListModule
    ],
    entryComponents: [ routedComponents.entry ],

    exports: [],
    providers: [],
})
export class SearchModule {};
