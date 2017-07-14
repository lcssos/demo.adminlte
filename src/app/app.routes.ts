import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './01.common/login/login.component';
import { LockComponent } from './01.common/lock/lock.component';

// {
//   path: '',
//     redirectTo: 'login',
//   pathMatch: 'full',
//   data: {
//   title : '系统登录'
// }
// },

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title : '系统登录'
    }
  }, {
    path: 'lock',
    component: LockComponent,
    data: {
      title : '锁定会话'
    }
  }, {
    path: '',
    loadChildren: './05.index/index.module#IndexModule',
    data: {
      title : '首页'
    }
  }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);
