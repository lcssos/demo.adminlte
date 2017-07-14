import { IndexComponent } from './index.component';
import {OpenslideComponent} from "../06.openslide/openslide.component";

export const indexRoutes = [
  {
    path: '',
    component: IndexComponent,
    children: [
      {
        path:'openslide',
        component: OpenslideComponent,
        data:{title:'病理'}
      }
      /*{ path: '', redirectTo: 'post', pathMatch: 'full' },
      { path: 'post', loadChildren: '../post/post.module#PostModule' },
      { path: 'comment', loadChildren: '../comment/comment.module#CommentModule' },
      { path: 'org', loadChildren: '../org/org.module#OrgModule' },
      { path: 'user', loadChildren: '../user/user.module#UserModule' },
      { path: 'role', loadChildren: '../role/role.module#RoleModule' },
      { path: 'permission', loadChildren: '../permission/permission.module#PermissionModule' },
      { path: 'sys', loadChildren: '../sys/sys.module#SysModule' },
      { path: 'map', loadChildren: '../map/map.module#MapModule' }*/
    ]
  }
];
