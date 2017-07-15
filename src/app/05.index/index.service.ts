import { Injectable } from '@angular/core';
import { Response, RequestOptions, Headers } from '@angular/http';

import 'rxjs/add/operator/map';

import { HttpInterceptorService } from '../02.shared/http-interceptor.service';

@Injectable()
export class IndexService {

  constructor(public http: HttpInterceptorService) {}


  public index(){
    return this.http.get('/').map((response: Response) => {
      return response;
    });
  }

}
