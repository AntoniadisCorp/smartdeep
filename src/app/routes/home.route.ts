import { Routes } from '@angular/router';

import { FullLayoutComponent } from '../containers';

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
      ]
    },
    {
      path: 'inventory', // Inventory
      component: FullLayoutComponent,
      children: [
        {
            path: '',
            loadChildren: () => import('../views/inventory/inventory.module').then(mod => mod.InventoryModule)
        }
      ]
    },
    {
      path: 'orders', // Orders
      component: FullLayoutComponent,
      children: [
        {
            path: '',
            loadChildren: () => import('../views/orders/orders.module').then(mod => mod.OrdersModule)
        }
      ]
    },
    {
      path: 'listing', // SmartHome
      component: FullLayoutComponent,
      children: [
        {
            path: '',
            loadChildren: () => import('../views/listing/listing.module').then(mod => mod.ListingModule)
        }
      ]
    },
    {
      path: 'charts', // SmartCar
      component: FullLayoutComponent,
      children: [
        {
            path: '',
            loadChildren: () => import('../views/chartjs/chartjs.module').then(mod => mod.ChartJSModule)
        }
      ]
    },
    {
      path: 'smartengine', // Smart Shop
      component: FullLayoutComponent,
      children: [
        {
            path: '',
            loadChildren: () => import('../views/smartengine/SmartEngine.module').then(mod => mod.SearchModule),
        }
      ]
    },
    {
      path: 'icons',
      component: FullLayoutComponent,
      children: [
        {
            path: '',
            loadChildren: () => import('../views/icons/fontawesome.module').then(mod => mod.FontsAwesomeModule),
        }
      ]
    },
    {
      path: 'delivery',
      component: FullLayoutComponent,
      children: [
        {
            path: '',
            loadChildren: () => import('../views/delivery/delivery.module').then(mod => mod.DeliveryModule),
        }
      ]
    }
];
