import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { ProcessingComponent, ShippedComponent, ArchivedComponent } from './components';

const routes: Routes = [
    { path: '',
        data: { title: 'Orders' },
        component: OrdersComponent,
        children: [
            { path: 'processing', component: ProcessingComponent, data: {title: 'Processing', animation: 'processing'} },
            { path: 'shipped', component: ShippedComponent, data: {title: 'Shipped', animation: 'shipped'}},
            { path: 'archived', component: ArchivedComponent, data: {title: 'Archived', animation: 'archived'} },
        ],
    }
];



@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrdersRoutingModule {}

export const routedComponents = {

    app: [  ],

    others: [
        OrdersComponent,
        ProcessingComponent,
        ShippedComponent,
        ArchivedComponent,
    ]
};
