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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LockComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    routing,
    SpinnerModule,
    AlertModule.forRoot()
  ],
  providers: [
    HttpInterceptorServiceFactoryProvider,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
