import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {
  ConnectionBackend,
  Http,
  Request,
  RequestOptions,
  RequestOptionsArgs,
  Response,
  XHRBackend
} from '@angular/http';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/finally';

import {ToastrService} from 'ngx-toastr';


import {environment} from '../../environments/environment';
import {SpinnerService} from '../04.spinner/spinner.service';
import {AlertConfig} from '../03.alert';


@Injectable()
export class HttpInterceptorService extends Http {
  // 计数器，记录当前有多少个正在挂起的请求
  private _pendingRequests = 0;

  constructor(backend: ConnectionBackend,
              defaultOptions: RequestOptions,
              private spinnerService: SpinnerService,
              private alertService: AlertConfig,
              private toastr: ToastrService,
              private router: Router) {
    super(backend, defaultOptions);
  }



  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {

    if (typeof url === 'string') {
      url = environment.remoteAddress + url;
    } else {
      url.url = environment.remoteAddress + url.url;
    }

    this._pendingRequests++;

    if (1 === this._pendingRequests) {
      this.spinnerService.isRunning = true;
    }

    return super.request(url, options)
      .map(result => {
        const resultObj = result.json();
        const status = resultObj.status;
        if (status === 200) {
          if(resultObj.message){
            this.toastr.success(resultObj.message);
          }
        }
        else if (status === 401) {
          this.toastr.show(resultObj.message);
          this.router.navigateByUrl('login');
        } else {
          this.alertService.showStatus = true;
          this.alertService.message = resultObj.message;
        }
        return result;
      })
      .catch(error => {
        // const errorObj = error.json();
        // if (errorObj.status === 401) {
        //   this.router.navigateByUrl('login');
        // } else {
        //   this.alertService.showStatus = true;
        //   this.alertService.message = errorObj.message;
        // }
        return Observable.of(error);
      })
      .finally(() => {
        this._pendingRequests--;

        if (0 === this._pendingRequests) {
          this.spinnerService.isRunning = false;
        }
      });
  }
}

export function HttpInterceptorServiceFactory(backend: XHRBackend,
                                              defaultOptions: RequestOptions,
                                              spinnerService: SpinnerService,
                                              alertService: AlertConfig,
                                              toastr: ToastrService,
                                              router: Router) {
  return new HttpInterceptorService(backend, defaultOptions, spinnerService, alertService, toastr, router);
}

export let HttpInterceptorServiceFactoryProvider = {
  provide: HttpInterceptorService,
  useFactory: HttpInterceptorServiceFactory,
  deps: [XHRBackend, RequestOptions, SpinnerService, AlertConfig, ToastrService, Router]
};
