import { NgbDatepickerModule, NgbTypeaheadModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { DropdownModule } from './dropdown.module';
import { FileUploadComponent } from '../components/app-components';
import { MaterialsModule } from '.';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';


@NgModule({
    declarations: [FileUploadComponent],
    imports: [CommonModule, MatButtonModule],
    exports: [FileUploadComponent]
})
export class UploadFileModule { }
