import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Inject, APP_ID, PLATFORM_ID } from '@angular/core';

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
import { AuthModule } from 'src/app/auth/auth.module';

// Import Modules
const APP_MODULES = [

  BrowserAnimationsModule,
  AppRoutingModule,
  MaterialsModule,
  AppNgModules,
  HttpClientModule,
  DropdownModule,
  AuthModule.forRoot(),
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
  routedComponents.others
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

];

// Import directives
import {
  AsideToggleDirective,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
} from './directives';
// import { APP_DELIVERY_COMPONENT } from './components/app-components';

const APP_DIRECTIVES = [

  // ...APP_DELIVERY_COMPONENT,
  AsideToggleDirective,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
];

// import Global Services
import { EventsService, Logger } from './services';
import { isPlatformBrowser } from '@angular/common';
import { AppComponent } from './app.component';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';

const APP_SERVICES = [

  Logger,
  EventsService,
];

@NgModule({
  declarations: [

    AppComponent,
    ...APP_CONTAINERS,
    ...APP_DIRECTIVES,
    ...APP_COMPONENTS
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'SECRET-APP-ID' }),
    BrowserTransferStateModule,
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ...APP_MODULES,
  ],
  providers: [ ...APP_SERVICES  ],
  schemas: [ NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
