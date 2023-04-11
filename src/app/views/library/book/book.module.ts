import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MaterialsModule, NgBootstrapModule } from '../../../modules';
import { BookRoutingModule, routedComponents } from './book.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UploadFileModule } from '../../../modules/uploadfile.module';
import { ItemListModule } from '../../../modules/list.module';

@NgModule({
    declarations: [ routedComponents.others, routedComponents.app],
    imports: [ CommonModule, FormsModule, ReactiveFormsModule, UploadFileModule,
         HttpClientModule, MaterialsModule, BookRoutingModule, NgBootstrapModule, ItemListModule ],
    // entryComponents: [ routedComponents.app ],
    exports: [],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BookModule {}
