import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmartEngineComponent } from './smartengine.component';
import { ImageListComponent, ItemListComponent, DeleteitemListDialogConfirm } from './components';
import { SmartResolveService } from '../../services';


const routes: Routes = [

  {
    path: '',
    data: {
      title: 'SearchEngine'
    },
    component: SmartEngineComponent,
    children: [
      { path: 'searchit', component: ItemListComponent, data: { title: 'Searchit', animation: 'item' } },
      {
        path: 'searchit/:id', component: ItemListComponent, data: { title: 'Searchit', animation: 'item' },
        /* resolve: { _id: SmartResolveService } */
      },
      {
        path: 'searchil', component: ImageListComponent, data: { title: 'Searchil', animation: 'image' },
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

  entry: [],

  others: [
    SmartEngineComponent,
    ImageListComponent,
  ]
};
