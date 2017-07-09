import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class SpinnerService {
  private _isRunning = false;
  private _runningStatus = new Subject<boolean>();

  set isRunning(value: boolean) {
    this._runningStatus.next(value);
    this._isRunning = value;
  }


  get runningStatus(): Observable<boolean> {
    return this._runningStatus;
  }
}
