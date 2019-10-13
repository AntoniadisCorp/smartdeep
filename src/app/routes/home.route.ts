import { Routes } from '@angular/router';

import { FullLayoutComponent } from '../containers';
import { RandomGuard } from '../auth/guard/random.guard';

export const HomeRoutes: Routes = [
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
      canActivate: [RandomGuard],
      canLoad: [RandomGuard]
    },
    {
      path: 'inventory', // Inventory
      component: FullLayoutComponent,
      children: [
        {
            path: '',
            loadChildren: () => import('../views/inventory/inventory.module').then(mod => mod.InventoryModule)
        }
      ],
      canActivate: [RandomGuard],
      canLoad: [RandomGuard]
    },
    {
      path: 'orders', // Orders
      component: FullLayoutComponent,
      children: [
        {
            path: '',
            loadChildren: () => import('../views/orders/orders.module').then(mod => mod.OrdersModule)
        }
      ],
      canActivate: [RandomGuard],
      canLoad: [RandomGuard]
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
      canActivate: [RandomGuard],
      canLoad: [RandomGuard]
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
      canActivate: [RandomGuard],
      canLoad: [RandomGuard]
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
      canActivate: [RandomGuard],
      canLoad: [RandomGuard]
    },
    {
      path: 'icons',
      component: FullLayoutComponent,
      children: [
        {
            path: '',
            loadChildren: () => import('../views/icons/fontawesome.module').then(mod => mod.FontsAwesomeModule),
        }
      ],
      canActivate: [RandomGuard],
      canLoad: [RandomGuard]
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
      canActivate: [RandomGuard],
      canLoad: [RandomGuard]
    }
];
