import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MaterialsModule, NgBootstrapModule } from 'src/app/modules';
import { BookRoutingModule, routedComponents } from './book.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadFileModule } from 'src/app/modules/uploadfile.module';
import { ItemListModule } from 'src/app/modules/list.module';

@NgModule({
    declarations: [ routedComponents.others, routedComponents.app],
    imports: [ CommonModule, FormsModule, ReactiveFormsModule, UploadFileModule,
         HttpClientModule, MaterialsModule, BookRoutingModule, NgBootstrapModule, ItemListModule ],
    entryComponents: [ routedComponents.app ],
    exports: [],
    providers: [],
    schemas: []
})
export class BookModule {}
