import { Injectable } from '@angular/core';
import { Response, RequestOptions, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

import { LoginUser } from './login-user-model';
import { HttpInterceptorService } from '../../02.shared/http-interceptor.service';

// this.subject.next(Object.assign({},user));
@Injectable()
export class LoginService {

  constructor(public http: HttpInterceptorService) {}

  public login (user: LoginUser) {

    let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    let options = new RequestOptions({headers});
    let urlSearchParams = new URLSearchParams();
    urlSearchParams.append('username', user.username);
    urlSearchParams.append('password', user.password);
    let body = urlSearchParams.toString()

    return this.http.post('/login', body, options).map((response: Response) => {
        return response;
      });
  }

  public logout(){
    return this.http.get('/logout').map((response: Response) => {
      return response;
    });
  }

  // public index(){
  //   return this.http.get('/').map((response: Response) => {
  //     return response;
  //   });
  // }

}
