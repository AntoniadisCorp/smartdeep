import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { RandomNumberComponent } from './random-number.component';
import { AuthGuard, GlobalGuard } from '../../auth/guard';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Service Pages'
    },
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: {
          title: 'Login Page'
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: {
          title: 'Sign Up Page'
        }
      },
      {
        path: 'secret-random-number',
        component: RandomNumberComponent,
        canActivate: [GlobalGuard],
        canLoad: [GlobalGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }

export const routedComponents = [

  LoginComponent,
  RegisterComponent,
  RandomNumberComponent
];
