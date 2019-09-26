import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

/* Import Noop Animations Module Js */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/* Import Hammer Js */
import * as Hammer from 'hammerjs';

/* Import App Routing Module and Components */
import { AppRoutingModule,
  routedComponents } from './app-routing.module';

/* Import Material design Module */
import { MaterialsModule, AppNgModules, DropdownModule } from './modules';

import { HttpClientModule } from '@angular/common/http';

// Import Modules
const APP_MODULES = [

  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  MaterialsModule,
  AppNgModules,
  HttpClientModule,
  DropdownModule,
  // MDBBootstrapModule.forRoot()
];

// Import containers
import {

  FullLayoutComponent,
  ExternLayoutComponent

} from './containers';

const APP_CONTAINERS = [

  FullLayoutComponent,
  ExternLayoutComponent,
  routedComponents.app,
  ...routedComponents.others
];

// Import components
import {

  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV,
  APP_PRODUCT_CARD
} from './components';

const APP_COMPONENTS = [

  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV,
  APP_PRODUCT_CARD
];

// Import directives
import {
  AsideToggleDirective,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
} from './directives';

const APP_DIRECTIVES = [

  AsideToggleDirective,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
];

@NgModule({
  declarations: [

    ...APP_CONTAINERS,
    ...APP_DIRECTIVES,
    ...APP_COMPONENTS
  ],
  imports: [

    ...APP_MODULES,
  ],
  providers: [],
  schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [ routedComponents.app ]
})
export class AppModule { }
