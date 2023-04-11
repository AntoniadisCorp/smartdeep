import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MaterialsModule, NgBootstrapModule, ItemListModule, UploadFileModule } from '../../../modules';
import { LibMapRoutingModule, routedComponents } from './libmap.routing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling'
import { DiacriticsPipe } from '../../../pipes';
import localeEl from '@angular/common/locales/el'

registerLocaleData(localeEl, 'el');

@NgModule({
    declarations: [routedComponents.others, routedComponents.app, DiacriticsPipe,/* FileUploadComponent */],
    imports: [ItemListModule, ReactiveFormsModule, UploadFileModule,
        HttpClientModule, LibMapRoutingModule, NgBootstrapModule, ScrollingModule],
    // entryComponents: [routedComponents.app],
    exports: [/* FileUploadComponent */],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LibMapModule { }
