import { NgModule } from '@angular/core';


import { PagesRoutingModule,
routedComponents } from './extern.routing';

@NgModule({
  imports: [ PagesRoutingModule ],
  declarations: [
    ...routedComponents
  ]
})
export class ExternModule { }
