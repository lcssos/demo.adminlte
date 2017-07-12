import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {LockComponent} from "./01.common/lock/lock.component";
import {LoginComponent} from "./01.common/login/login.component";
import {AlertModule} from "./03.alert/alert.module";
import {SharedModule} from "./02.shared/shared.module";
import {HttpInterceptorServiceFactoryProvider} from "./02.shared/http-interceptor.service";
import {SpinnerModule} from "./04.spinner/spinner.module";
import { routing } from './app.routes';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {Http, HttpModule} from "@angular/http";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {LoginService} from "./01.common/login/login.service";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

export function createTranslateLoader(http: Http) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LockComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    SharedModule,
    HttpModule,
    routing,
    SpinnerModule,
    AlertModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [Http]
      }
    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      autoDismiss: true,
      maxOpened: 2
    })
  ],
  providers: [
    HttpInterceptorServiceFactoryProvider,
    LoginService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
