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
    // let headers = new Headers();
    // headers.append('Access-Control-Allow-Headers','Content-Type');
    // headers.append('Access-Control-Allow-Methods','POST');
    // headers.append('Access-Control-Allow-Origin','*');
    // let options = new RequestOptions({ headers: headers });
    return this.http
      .post('springboot/login', user)
      .map((response: Response) => {
        const user = response.json().data;
        console.log('user object>' + JSON.stringify(user));
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
        return response;
      });
  }

}
