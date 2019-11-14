import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmartEngineComponent } from './smartengine.component';
import { ImageListComponent, ItemListComponent } from './components';
import { InventoryService } from 'src/app/services';


const routes: Routes = [

    {
        path: '',
        data: {
          title: 'SearchEngine'
        },
        component: SmartEngineComponent,
        children: [
          { path: 'searchit', component: ItemListComponent, data: {title: 'Searchit', animation: 'item'},
          /* resolve: {collection: InventoryService} */ },
          { path: 'searchil', component: ImageListComponent, data: {title: 'Searchil', animation: 'image'},
             },
        ]
      }
];

@NgModule({

  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EngineRoutingModule { }

export const routedComponents = {

    app: [],

    others: [
        SmartEngineComponent,
        ImageListComponent,
        ItemListComponent
    ]
} ;
