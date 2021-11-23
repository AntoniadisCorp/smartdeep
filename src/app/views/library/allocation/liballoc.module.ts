import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgBootstrapModule, ItemListModule } from '../../../modules';
import { ReactiveFormsModule } from '@angular/forms';
import { ScrollingModule } from '@angular/cdk/scrolling'
import { LibAllocRoutingModule, routedComponents } from './liballoc.routing';


@NgModule({
    declarations: [routedComponents.others, routedComponents.app, /* FileUploadComponent */],
    imports: [ItemListModule, ReactiveFormsModule, HttpClientModule, LibAllocRoutingModule, NgBootstrapModule, ScrollingModule],
    // entryComponents: [routedComponents.app],
    exports: [/* FileUploadComponent */],
    providers: [],
    schemas: []
})
export class LibAllocModule { }