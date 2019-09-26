import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';

const NgbMapModule = [
    NgbDatepickerModule,
];

@NgModule({
  imports: [NgbMapModule],
  exports: [NgbMapModule]
})
export class NgBootstrapModule {}
