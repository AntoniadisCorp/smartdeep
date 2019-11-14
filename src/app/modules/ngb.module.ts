import {NgbDatepickerModule, NgbTypeaheadModule, NgbProgressbarModule} from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';

const NgbMapModule = [
    NgbDatepickerModule, NgbTypeaheadModule, NgbProgressbarModule
];

@NgModule({
  imports: [NgbMapModule],
  exports: [NgbMapModule]
})
export class NgBootstrapModule {}
