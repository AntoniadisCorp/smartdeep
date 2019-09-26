import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './containers';

import { HomeRoutes, ExternRoutes } from './routes';

const routes: Routes = [

    ...HomeRoutes,
    ...ExternRoutes,

    { path: '**', pathMatch: 'full', component: PageNotFoundComponent }
];

@NgModule({

  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})

export class AppRoutingModule { }

export const routedComponents = {

    app: AppComponent,

    others: [ PageNotFoundComponent ]
};
