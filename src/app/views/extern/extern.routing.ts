import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';

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
        }
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: {
          title: 'Register Page'
        }
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
  RegisterComponent
];
