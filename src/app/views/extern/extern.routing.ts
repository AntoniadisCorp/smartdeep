import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { RandomNumberComponent } from './random-number.component';
import { RandomGuard } from 'src/app/auth/guard/random.guard';
import { AuthGuard } from 'src/app/auth/guard/auth.guard';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Extern Pages'
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
          title: 'Register Page'
        }
      },
      {
        path: 'secret-random-number',
        component: RandomNumberComponent,
        canActivate: [RandomGuard],
        canLoad: [RandomGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}

export const routedComponents = [

  LoginComponent,
  RegisterComponent,
  RandomNumberComponent
];
