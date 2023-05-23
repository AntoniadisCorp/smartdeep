import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'

import { PageNotFoundComponent } from './containers'

import { LandingRoutes, UserPanelRoutes, ServiceRoutes } from './routes'

const routes: Routes = [

  ...LandingRoutes,
  ...UserPanelRoutes,
  ...ServiceRoutes,

  { path: '**', pathMatch: 'full', component: PageNotFoundComponent }
]

@NgModule({

  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking' })],
  exports: [RouterModule],
})

// {initialNavigation: 'enabled'}

export class AppRoutingModule { }

export const routedComponents = {
  others: [PageNotFoundComponent]
}
