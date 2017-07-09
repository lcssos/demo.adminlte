import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

import { LoginUser } from './login-user-model';
import { HttpInterceptorService } from '../../02.shared/http-interceptor.service';

// this.subject.next(Object.assign({},user));
@Injectable()
export class LoginService {

  constructor(public http: HttpInterceptorService) {}

  public login (user: LoginUser) {
    return this.http
      .post('springboot/login', user)
      .map((response: Response) => {
        const user = response.json();
        // console.log('user object>' + JSON.stringify(user));
        if (user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        return response;
      });
  }

}
