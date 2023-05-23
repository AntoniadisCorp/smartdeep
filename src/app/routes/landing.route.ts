import { Routes } from '@angular/router'
import { LandingLayoutComponent } from '../containers'

export const LandingRoutes: Routes = [

    {
        path: '', // dashboard
        pathMatch: 'full',
        component: LandingLayoutComponent,
    }


]
