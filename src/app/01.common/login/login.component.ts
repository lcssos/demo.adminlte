import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { TranslateService } from '@ngx-translate/core';

import { fadeInOut } from '../animations/fade-in-out';
import { LoginUser } from './login-user-model';
import { LoginService } from './login.service';
import { AlertConfig } from '../../03.alert';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [fadeInOut]
})
export class LoginComponent implements OnInit {

  public user: LoginUser = new LoginUser ();
  public error: any = {
    show: false,
    msg: ''
  };

  constructor(
    public router: Router,
    public loginService: LoginService,
    public translate: TranslateService,
    private alertConfig: AlertConfig
  ) { }

  ngOnInit() {
    console.log('login...')
    $('body, html, .wrapper').css('height', $(window).height()+'px');
    $(window, "body").resize(function () {
      $('body, html, .wrapper').css('height', $(window).height()+'px');
    });
    // $('input').iCheck({
    //   checkboxClass: 'icheckbox_square-blue',
    //   radioClass: 'iradio_square-blue'
    // });
  }



  onChange() {
    this.alertConfig.showStatus = false;
  }

  doLogin(form: NgForm) {
    if (form.valid) {
      this.loginService.login(this.user)
        .subscribe(
          data => {
            if (data.json().data != null) {
              this.router.navigateByUrl('index');
            }
          }
        );

    }

  }

}
