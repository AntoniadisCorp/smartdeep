import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InventoryComponent } from './inventory.component';
import { /* ItemComponent, */ KitComponent, WarehouseComponent,
    TransferOrderComponent, CycleCountComponent, ReceiveComponent,
    DeductComponent, WizardComponent
} from './components';

const routes: Routes = [
    {
        path: '',
        data: { title: 'Inventory' },
        component: InventoryComponent,
        children: [
            // { path: 'items', component: ItemComponent, data: {title: 'Items', animation: 'item'} },
            { path: 'kits', component: KitComponent, data: { title: 'Kits', animation: 'kits' } },
            { path: 'warehouses', component: WarehouseComponent, data: { title: 'Warehouses', animation: 'warehouse' } },
            { path: 'transferorders', component: TransferOrderComponent, data: { title: 'Transfer Orders', animation: 'transferorder' } },
            { path: 'cyclecounts', component: CycleCountComponent, data: { title: 'Cycle Counts', animation: 'cyclecount' } },
            { path: 'receive', component: ReceiveComponent, data: { title: 'Receive', animation: 'receive' } },
            { path: 'deduct', component: DeductComponent, data: { title: 'Deduct', animation: 'deduct' } },
            { path: 'wizard', component: WizardComponent, data: { title: 'Wizard', animation: 'wizard' } },
        ],
    }
];



@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InventoryRoutingModule { }

export const routedComponents = {

    app: [
        InventoryComponent,
        /* ItemComponent, */
        KitComponent,
        WarehouseComponent,
        TransferOrderComponent,
        CycleCountComponent,
        ReceiveComponent,
        DeductComponent,
        WizardComponent,
    ]
};
