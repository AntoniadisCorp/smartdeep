import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


/* Start Routing Module */
import { StartRoutingModule
, routedComponents } from './fontawesome.routing';

import { MaterialsModule } from '../../modules';

@NgModule({

    imports: [
        CommonModule,
        StartRoutingModule,
        MaterialsModule
    ],
    declarations: [

        ...routedComponents.others
    ],
    exports: [],
    providers: [],
})
export class FontsAwesomeModule {}
