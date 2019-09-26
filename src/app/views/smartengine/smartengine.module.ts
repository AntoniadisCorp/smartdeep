import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/* Start Routing Module */
import { EngineRoutingModule
    , routedComponents } from './smartengine.routing';

import { MaterialsModule, AppNgModules } from '../../modules';

import { ReDirective } from '../../directives';



const APP_DIRECTIVES = [
    ReDirective,
]

@NgModule({
    declarations: [

        ...routedComponents.others,
        ...APP_DIRECTIVES,
    ],
    imports: [ AppNgModules,
        EngineRoutingModule,
        MaterialsModule,
    ],

    exports: [],
    providers: [],
})
export class SearchModule {}