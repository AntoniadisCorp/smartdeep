import { NgModule } from '@angular/core';


import { PagesRoutingModule,
routedComponents } from './extern.routing';
import { AuthModule } from 'src/app/auth/auth.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialsModule } from 'src/app/modules';

@NgModule({
  imports: [ PagesRoutingModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialsModule, ],
  declarations: [
    ...routedComponents
  ]
})
export class ExternModule { }
