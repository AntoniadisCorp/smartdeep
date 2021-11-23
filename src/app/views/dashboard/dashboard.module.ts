import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

/* Start Routing Module */
import { DashboardRoutingModule
, routedComponents } from './dashboard.routing';

/* Angular Materials Components */
import { MaterialsModule, DropdownModule } from '../../modules';

/* Custom Components of current Route */
import { APP_CATEGORY_COMPONENT } from '../../components/app-components';

import { ReeDirective } from '../../directives';

@NgModule({

    imports: [
        CommonModule,
        DashboardRoutingModule,
        MaterialsModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        DropdownModule
    ],
    declarations: [

        ...routedComponents.app,
        ...APP_CATEGORY_COMPONENT,
        ReeDirective,
    ],
    // entryComponents: [],
    exports: [
        ...routedComponents.app,
        ...APP_CATEGORY_COMPONENT,
        ReeDirective
    ],
    providers: [],
})
export class DashboardModule {}
