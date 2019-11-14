import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MaterialsModule, NgBootstrapModule } from 'src/app/modules';
import { LibraryRoutingModule, routedComponents } from './library.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FileUploadComponent } from '../../components/app-components';

@NgModule({
    declarations: [ routedComponents.others, routedComponents.app, FileUploadComponent ],
    imports: [ CommonModule, FormsModule, ReactiveFormsModule,
         HttpClientModule, MaterialsModule, LibraryRoutingModule, NgBootstrapModule ],
    entryComponents: [ routedComponents.app ],
    exports: [FileUploadComponent],
    providers: [],
    schemas: []
})
export class LibraryModule {}