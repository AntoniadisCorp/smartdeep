import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { DeliveryComponent } from './delivery.component';

const routes: Routes = [
    {
      path: '',
      component: DeliveryComponent,
      data: {
        title: 'Delivery'
      }
    }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DeliveryRoutingModule {}

export const routedComponents = [
    DeliveryComponent
];
