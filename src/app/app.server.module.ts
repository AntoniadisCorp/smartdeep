import { NgModule } from '@angular/core'
import {
    ServerModule,
    ServerTransferStateModule, // <--- Added
} from '@angular/platform-server'

/* Import Noop Animations Module Js */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
// import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import {FlexLayoutServerModule} from '@angular/flex-layout/server'

import { AppModule } from './app.module'
import { AppComponent } from './app.component'

@NgModule({
    declarations: [],
    imports: [
        AppModule,
        BrowserAnimationsModule,
        ServerModule,
        // ModuleMapLoaderModule,
        // ServerTransferStateModule, // <--- Added
        FlexLayoutServerModule,
        // BrowserModule.withServerTransition({ appId: 'tour' }),
    ],
    providers: [
        // Add universal-only providers here
    ],
    bootstrap: [AppComponent]
})
export class AppServerModule {}
