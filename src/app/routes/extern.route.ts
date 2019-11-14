import { Routes } from '@angular/router';

import { ExternLayoutComponent } from '../containers';

export const ExternRoutes: Routes = [

    {
      path: 'extern',
      component: ExternLayoutComponent,
      data: {
        title: 'extern'
      },
      children: [
        {
          path: '',
          loadChildren: () => import('../views/extern/extern.module').then(mod => mod.ExternModule),
        }
      ]
    },
];

