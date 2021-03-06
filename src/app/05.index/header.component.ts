import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';


import { ModalDirective } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';


import { Password } from './password';
import {LoginService} from "../01.common/login/login.service";
import {ShiroUser} from "../01.common/login/shiro-user-model";


@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrls: ['header.component.css']
})
export class HeaderComponent implements OnInit {

  @ViewChild('chPwdModal') public chPwdModal : ModalDirective;
  @ViewChild('chPwdForm') public chPwdForm : NgForm;

  public pwd : Password = new Password ();
  public lockSwal : any = {
    title: "",
    text: "",
    type: "warning",
    confirmButtonText: ""
  };

  public logoutSwal : any = {
    title: "",
    text: "",
    type: "warning",
    confirmButtonText: ""
  };

  @Input() public user: ShiroUser;


  constructor(
    public router: Router,
    public toastr: ToastrService,
    public loginService: LoginService,
    public translate: TranslateService
  ) {


    // this.loginService.index().subscribe(data => {
    //   this.user = data.json().data;
    // });
  }

  ngOnInit() {
    this.translate.get("sys.headerModule.dropDown").subscribe((res : any) => {
      this.lockSwal.title = res.lockTitle;
      this.lockSwal.text = res.lockContent;
      this.lockSwal.confirmButtonText = res.lockBtnText;

      this.logoutSwal.title = res.logoutTitle;
      this.logoutSwal.text = res.logoutContent;
      this.logoutSwal.confirmButtonText = res.logoutBtnText;

    });

  }

  /**
   * 打开修改密码的对话框
   */
  showChPwdModal () {
    console.log('chg pwd');
    this.chPwdForm.reset();
    this.chPwdModal.show();
  }

  /**
   * 提交修改密码
   * @param form
   */
  doChangePwd () {
    if (this.chPwdForm.valid) {
      this.chPwdModal.hide();
      this.translate.get("sys.headerModule.changePwdModal.successTips").subscribe((res : any) => {
        this.toastr.success(res.content, res.title);
      });

    }
  }

  /**
   * 注销登录
   */
  doLogout() {
    // console.log('logout...')
    this.loginService.logout().subscribe(
      data => {
        this.router.navigateByUrl('login');
      }
    );

  }

  doLock () {
    this.router.navigateByUrl('lock');
  }


}
