import { Routes } from '@angular/router';

import { ServiceLayoutComponent } from '../containers';

export const ServiceRoutes: Routes = [

  {
    path: 'service',
    component: ServiceLayoutComponent,
    data: {
      title: 'service'
    },
    children: [
      {
        path: '',
        loadChildren: () => import('../views/service/service.module').then(mod => mod.ServiceModule),
      }
    ]
  },
];

