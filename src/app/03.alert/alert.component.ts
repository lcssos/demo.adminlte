import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { fadeInOut } from '../01.common/animations/fade-in-out';

import { AlertConfig } from './alert.config';
import { OnChange } from '../01.common/utils';

@Component({
  selector: 'alert,bootstrap-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  animations: [fadeInOut]
})
export class AlertComponent implements OnInit {

  /** Alert type. Provides one of four bootstrap supported contextual classes: `success`, `info`, `warning` and `danger` */
  @Input() public type = 'warning';
  /** If set, displays an inline "Close" button */
  @OnChange()
  @Input() public dismissible = false;
  /** Number in milliseconds, after which 03.alert will be closed */
  @Input() public dismissOnTimeout: number | string;

  @OnChange()
  @Input() public isShow = false;


  /** This event fires immediately after close instance method is called, $event is an instance of Alert component. */
  @Output() public onClose: EventEmitter<AlertComponent> = new EventEmitter<AlertComponent>();
  /** This event fires when 03.alert closed, $event is an instance of Alert component */
  @Output() public onClosed: EventEmitter<AlertComponent> = new EventEmitter<AlertComponent>();

  public isClosed = false;
  public classes = '';
  public message = '';
  public icon = '';
  public dismissibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  public isShowChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public constructor(_config: AlertConfig) {
    Object.assign(this, _config);
    switch (this.type) {
      case 'danger':
        this.icon = 'close';
        break;
      case 'success':
        this.icon = 'check';
        break;
      case 'warning':
        this.icon = 'warning';
        break;
      case 'info':
        this.icon = 'warning';
        break;
      default:
        this.icon = 'warning';
        break;
    }
    this.dismissibleChange.subscribe((dismissible: boolean) => {
      this.classes = this.dismissible ? '03.alert-dismissible' : '';
    });
    this.isShowChange.subscribe((isShow: boolean) => {
      this.isShow = isShow;
    });
    _config.toggleShow.subscribe((isShow: boolean) => {
      this.isShow = isShow;
    });
    _config.messageChange.subscribe((msg: string) => {
      this.message = msg;
    });
  }

  public ngOnInit(): void {
    if (this.dismissOnTimeout) {
      // if dismissOnTimeout used as attr without binding, it will be a string
      setTimeout(() => this.close(),
        parseInt(this.dismissOnTimeout as string, 10));
    }
  }

  // todo: animation ` If the .fade and .in classes are present on the element,
  // the 03.alert will fade out before it is removed`
  /**
   * Closes an 03.alert by removing it from the DOM.
   */
  public close(): void {
    if (this.isClosed) {
      return;
    }

    this.onClose.emit(this);
    this.isClosed = true;
    this.onClosed.emit(this);
  }

}
