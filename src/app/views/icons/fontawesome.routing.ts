import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FontComponent } from './fontawesome.component';


const routes: Routes = [

    {
        path: '',
        data: {
          title: 'Icons'
        },
        children: [
            {
              path: 'font-awesome',
              component: FontComponent,
              data: {
                title: 'FontsAwesome'
              }
            },
        ]
      }
];

@NgModule({

  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartRoutingModule { }

export const routedComponents = {

    app: [],

    others: [
        FontComponent
    ]
} ;
