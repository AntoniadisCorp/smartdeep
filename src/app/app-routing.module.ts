import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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

//, {initialNavigation: 'enabled'}

export class AppRoutingModule { }

export const routedComponents = {
    others: [ PageNotFoundComponent ]
};
