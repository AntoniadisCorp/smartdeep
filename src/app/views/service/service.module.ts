import { NgModule } from '@angular/core'


import {
  PagesRoutingModule,
  routedComponents
} from './service.routing'
import { AuthModule } from '../../auth/auth.module'
import { CommonModule } from '@angular/common'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'
import { MaterialsModule } from '../../modules'

@NgModule({
  imports: [PagesRoutingModule,
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,
    MaterialsModule,],
  declarations: [
    ...routedComponents
  ]
})
export class ServiceModule { }
