import {NgbDatepickerModule, NgbTypeaheadModule, NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { DropdownModule } from './dropdown.module';

const NgbMapModule = [
    NgbDatepickerModule, NgbTypeaheadModule, NgbProgressbarModule, DropdownModule
];

@NgModule({
  imports: [NgbMapModule],
  exports: [NgbMapModule]
})
export class NgBootstrapModule {}
