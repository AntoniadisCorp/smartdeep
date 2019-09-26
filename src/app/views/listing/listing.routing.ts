import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ListingComponent } from './listing.component';
// import { ChildrenOutletContexts } from '@angular/router/src/router_outlet_context';

import { ButtonsComponent } from './buttons.component';
import { CardsComponent } from './cards.component';
import { FormsComponent } from './forms.component';
import { ModalsComponent } from './modals.component';
import { SocialButtonsComponent } from './social-buttons.component';
import { SwitchesComponent } from './switches.component';
import { TablesComponent } from './tables.component';
import { TabsComponent } from './tabs.component';

const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Listing'
        },
        // component: ListingComponent,
        children: [
            {
              path: 'buttons',
              component: ButtonsComponent,
              data: {
                title: 'Buttons'
              }
            },
            {
              path: 'cards',
              component: CardsComponent,
              data: {
                title: 'Cards'
              }
            },
            {
              path: 'forms',
              component: FormsComponent,
              data: {
                title: 'Forms'
              }
            },
            {
              path: 'modals',
              component: ModalsComponent,
              data: {
                title: 'Modals'
              }
            },
            {
              path: 'social-buttons',
              component: SocialButtonsComponent,
              data: {
                title: 'Social buttons'
              }
            },
            {
              path: 'switches',
              component: SwitchesComponent,
              data: {
                title: 'Switches'
              }
            },
            {
              path: 'tables',
              component: TablesComponent,
              data: {
                title: 'Tables'
              }
            },
            {
              path: 'tabs',
              component: TabsComponent,
              data: {
                title: 'Tabs'
              }
            }
          ]

     },

    // { path: 'path/:routeParam', component: MyComponent },
    // { path: 'staticPath', component: ... },
    // { path: '**', component: ... },
    // { path: 'oldPath', redirectTo: '/staticPath' },
    // { path: ..., component: ..., data: { message: 'Custom' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class FeatureRoutingModule {}

export const routedComponents = [
  ListingComponent,
  TabsComponent,
  ButtonsComponent,
  CardsComponent,
  FormsComponent,
  ModalsComponent,
  SocialButtonsComponent,
  SwitchesComponent,
  TablesComponent
 ];


