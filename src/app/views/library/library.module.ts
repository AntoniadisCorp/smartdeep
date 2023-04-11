import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { CommonModule } from '@angular/common'
import { MaterialsModule, NgBootstrapModule } from '../../modules'
import { LibraryRoutingModule, routedComponents } from './library.routing'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { UploadFileModule } from '../../modules/uploadfile.module'
import { DiacriticsPipe } from '../../pipes/diacriticsform.pipe'

@NgModule({
    declarations: [routedComponents.others, routedComponents.app, /* FileUploadComponent */],
    imports: [CommonModule, FormsModule, ReactiveFormsModule, UploadFileModule,
        HttpClientModule, MaterialsModule, LibraryRoutingModule, NgBootstrapModule],
    entryComponents: [routedComponents.app],
    exports: [/* FileUploadComponent */],
    providers: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LibraryModule { }
