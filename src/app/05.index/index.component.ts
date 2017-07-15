import { Component, OnInit } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import {IndexService} from "./index.service";
import {ShiroUser} from "../01.common/login/shiro-user-model";


@Component( {
  selector: 'index',
  templateUrl: 'index.component.html'
})

export class IndexComponent implements OnInit {
  private opts: any = {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    showCancelButton: true
  };

  shiroUser: ShiroUser;

  constructor (public translate: TranslateService, public indexService: IndexService) {
    this.translate.get("sys.common").subscribe((res : any) => {
      this.opts.confirmButtonText = res.confirmBtnText;
      this.opts.cancelButtonText = res.cancelBtnText;
    });

    // swal.setDefaults(this.opts);

    this.indexService.index().subscribe(data => {
      this.shiroUser = data.json().data;
    });

  }

  public ngOnInit() {
    require('../../../node_modules/jquery-slimscroll/jquery.slimscroll.js');
    require('../../../node_modules/admin-lte/dist/js/app.js');

  }
}
