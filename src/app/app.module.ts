import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, Inject, APP_ID, PLATFORM_ID } from '@angular/core'

/* Import Noop Animations Module Js */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NgChartsModule } from 'ng2-charts'
/* Import Hammer Js */
// import * as Hammer from 'hammerjs';

/* Import App Routing Module and Components */
import {
  AppRoutingModule,
  routedComponents
} from './app-routing.module'

/* Import Material design Module */
import { MaterialsModule, AppNgModules, DropdownModule } from './modules'
import { HttpClientModule } from '@angular/common/http'
import { AuthModule } from '../app/auth/auth.module'
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'

/* Import and configure SocketIoModule */
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io'

const socketConfig: SocketIoConfig = {
  url: config.apiUrl, options: {
    withCredentials: true,
    extraHeaders: {
      secretHeader: 'secret value'
    }
  }
}

// Import Modules
const APP_MODULES = [

  BrowserAnimationsModule,
  AppRoutingModule,
  MaterialsModule,
  AppNgModules,
  HttpClientModule,
  DropdownModule,
  NgChartsModule,
  AuthModule.forRoot(),
  // MDBBootstrapModule.forRoot()
  NgbDropdownModule,
  SocketIoModule.forRoot(socketConfig)
]

// Import containers
import {

  LandingLayoutComponent,
  FullLayoutComponent,
  ServiceLayoutComponent

} from './containers'

const APP_CONTAINERS = [

  LandingLayoutComponent,
  FullLayoutComponent,
  ServiceLayoutComponent,
  routedComponents.others
]

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
} from './components'

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

]

// Import directives
import {
  AsideToggleDirective,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
} from './directives'
// import { APP_DELIVERY_COMPONENT } from './components/app-components';

const APP_DIRECTIVES = [

  // ...APP_DELIVERY_COMPONENT,
  AsideToggleDirective,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
]

// import Global Services
import { EventsService, Logger, SvgIconService } from './services'
import { isPlatformBrowser } from '@angular/common'
import { AppComponent } from './app.component'
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser'
// import { url } from 'inspector';
import { config } from './variables/global.vars'
import { SocketService } from './services/socket.service'

const APP_SERVICES = [

  Logger,
  EventsService,
  SvgIconService,
  SocketService,
  { provide: 'LOCALSTORAGE', useFactory: getLocalStorage }
]

@NgModule({
  declarations: [

    AppComponent,
    ...APP_CONTAINERS,
    ...APP_DIRECTIVES,
    ...APP_COMPONENTS
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'SECRET-APP-ID' }),
    // BrowserTransferStateModule,
    // ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
    ...APP_MODULES,
  ],
  providers: [...APP_SERVICES],
  schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(APP_ID) private appId: string) {
    (window as any).global = window
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server'
    console.log(`Running ${platform} with appId=${appId}`)
  }
}

// Stub for localStorage
const localStorage = {
  getItem(key: any) {
    return this[key]
  },
  setItem(key: any, value: any) {
    this[key] = value
  }
}

export function getLocalStorage() {
  return (typeof this.window !== 'undefined') ? this.window.localStorage : localStorage
}
