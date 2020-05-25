import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MaterialsModule, NgBootstrapModule, ItemListModule, UploadFileModule } from '../../../modules';
import { LibMapRoutingModule, routedComponents } from './libmap.routing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling'


@NgModule({
    declarations: [routedComponents.others, routedComponents.app, /* FileUploadComponent */],
    imports: [ItemListModule, ReactiveFormsModule, UploadFileModule,
        HttpClientModule, LibMapRoutingModule, NgBootstrapModule, ScrollingModule],
    entryComponents: [routedComponents.app],
    exports: [/* FileUploadComponent */],
    providers: [],
    schemas: []
})
export class LibMapModule { }
