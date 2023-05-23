import { Routes } from '@angular/router'

import { FullLayoutComponent } from '../containers'
import { GlobalGuard } from '../auth/guard'

export const UserPanelRoutes: Routes = [
  {
    path: 'dashboard', // dashboard
    // pathMatch: 'full',
    component: FullLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../views/dashboard/dashboard.module').then(mod => mod.DashboardModule)
      }
    ],
    canActivate: [GlobalGuard],
    canLoad: [GlobalGuard]
  },
  /*   {
      path: 'inventory', // Inventory
      component: FullLayoutComponent,
      children: [
        {
            path: '',
            loadChildren: () => import('../views/inventory/inventory.module').then(mod => mod.InventoryModule)
        }
      ],
      canActivate: [GlobalGuard],
      canLoad: [GlobalGuard]
    }, */
  {
    path: 'library', // Orders
    component: FullLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../views/library/library.module').then(mod => mod.LibraryModule)
      }
    ],
    canActivate: [GlobalGuard],
    canLoad: [GlobalGuard]
  },
  {
    path: 'smartengine', // Smart Shop
    component: FullLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../views/smartengine/smartengine.module').then(mod => mod.SearchModule),
      }
    ],
    canActivate: [GlobalGuard],
    canLoad: [GlobalGuard]
  },
  {
    path: 'listing', // SmartHome
    component: FullLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../views/listing/listing.module').then(mod => mod.ListingModule)
      }
    ],
    canActivate: [GlobalGuard],
    canLoad: [GlobalGuard]
  },
  {
    path: 'charts', // SmartCar
    component: FullLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../views/chartjs/chartjs.module').then(mod => mod.ChartJSModule)
      }
    ],
    canActivate: [GlobalGuard],
    canLoad: [GlobalGuard]
  },
  {
    path: 'delivery',
    component: FullLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('../views/delivery/delivery.module').then(mod => mod.DeliveryModule),
      }
    ],
    canActivate: [GlobalGuard],
    canLoad: [GlobalGuard]
  }
]
