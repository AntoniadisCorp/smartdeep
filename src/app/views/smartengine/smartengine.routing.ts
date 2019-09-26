import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SmartEngineComponent } from './smartengine.component';


const routes: Routes = [

    {
        path: '',
        data: {
          title: 'SearchEngine'
        },
        component: SmartEngineComponent
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
        SmartEngineComponent
    ]
} ;
