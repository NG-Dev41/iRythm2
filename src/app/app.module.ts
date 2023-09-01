import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { metaReducers, reducers } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { FindingsEffects } from './store/effects';


// 3rd Party
import { OktaAuthModule, OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';



// Configs
import { dbConfig } from 'app/core/config/db.config';

// Environment Config
import { environment } from '../environments/environment';

// Modules
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './modules/material/material.module';

// Http Interceptors
import { AuthTokenInterceptor } from './core/http-interceptors/auth-token/auth-token.interceptor';
import { ErrorHandlerInterceptor } from './core/http-interceptors/error/error-handler.interceptor';
import { InternetCheckInterceptor } from './core/http-interceptors/internet-check/internet-check.interceptor';

// Components
import { AppComponent } from './app.component';
import { HeaderNotificationsComponent } from './features/record/header-notifications/header-notifications.component';
import { PageNotifier } from './commons/services/notifiers/page-notifier.service';

// Set Okta config
const oktaAuth = new OktaAuth(environment.oktaConfig);

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        AppComponent,
        HeaderNotificationsComponent
    ],
    imports: [
        HttpClientModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        OktaAuthModule,
        MaterialModule,
        NgxIndexedDBModule.forRoot(dbConfig),
        TranslateModule.forRoot({
            defaultLanguage: 'en',
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            extend: true
        }),
        StoreModule.forRoot(reducers, {
            metaReducers,
            runtimeChecks : {
                strictStateImmutability: true,
                strictActionImmutability: true,
                strictActionSerializability: true,
                strictStateSerializability:true
            }
        }),
        EffectsModule.forRoot([FindingsEffects]),
        StoreDevtoolsModule.instrument({maxAge: 25, logOnly: environment.production}),
    ],
    providers: [
        PageNotifier,
        {
            provide: OKTA_CONFIG,
            useValue: { oktaAuth }
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandlerInterceptor,
            multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: InternetCheckInterceptor,
          multi: true
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthTokenInterceptor,
          multi: true
        }
    ],
    bootstrap: [
        AppComponent
    ],
})
export class AppModule { }
