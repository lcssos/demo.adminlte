import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';


import { ModalModule } from 'ngx-bootstrap';
// import { SweetAlert2Module } from '@toverux/ngsweetalert2';

import { EqualValidator } from '../01.common/directives/equal-validator.directive';

import { indexRoutes } from './index.router';
import { SharedModule } from '../02.shared/shared.module';
import { IndexComponent } from './index.component';
import { HeaderComponent } from './header.component';
import { FooterComponent } from './footer.component';
import { MenuComponent } from './menu.component';
import { RightAsideComponent } from './right-aside.component';
import { HomeComponent } from './home.component';
import {OpenslideModule} from "../06.openslide/openslide.module";

// https://github.com/toverux/ngsweetalert2
@NgModule({
  imports: [
    SharedModule,
    OpenslideModule,
    ModalModule.forRoot(),
    // SweetAlert2Module.forRoot({
    //   showCancelButton: true
    // }),
    RouterModule.forChild(indexRoutes)
  ],
  exports: [],
  declarations: [
    EqualValidator,
    IndexComponent,
    HeaderComponent,
    FooterComponent,
    MenuComponent,
    RightAsideComponent,
    HomeComponent
  ],
  providers: [],
})
export class IndexModule {
}
