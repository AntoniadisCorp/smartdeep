import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

// TODO: Create App.routing
import { FeatureRoutingModule, routedComponents } from './listing.routing';

// Modal Component
// import { ModalModule } from 'ngx-bootstrap/modal';
import { MaterialsModule } from '../../modules';

// Forms Component
// import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

// Tabs Component
// import { TabsModule } from 'ngx-bootstrap/tabs';

@NgModule({
    imports: [
        HttpClientModule,
        MaterialsModule,
        FeatureRoutingModule,
        // ModalModule.forRoot(),
        // BsDropdownModule.forRoot(),
        // TabsModule
    ],
    declarations: [ ...routedComponents ],
    providers: [/* TODO: Providers go here */],
    schemas: [NO_ERRORS_SCHEMA]
})
export class ListingModule { }
