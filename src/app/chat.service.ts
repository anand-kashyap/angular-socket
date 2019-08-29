import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private errMsgSub = new Subject<string>();

  constructor() {}

  isLoggedIn() {
    return this.getUserInfo() ? this.getUserInfo() : false;
  }

  clearUser() {
    localStorage.removeItem('user');
  }

  setInLocal(key: string, val: any) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  getFromLocal(key: string, json = true): any {
    let item = localStorage.getItem(key);
    if (json && item) {
      item = JSON.parse(item);
    }
    return item;
  }

  getUserInfo(socketUser = false) {
    if (socketUser) {
      return this.getFromLocal('sUser');
    }
    return this.getFromLocal('user');
  }

  setUserInfo(val, socketUser = false) {
    if (socketUser) {
      return this.setInLocal('sUser', val);
    }
    return this.setInLocal('user', val);
  }

  setErrorMsg(val: string) {
    this.errMsgSub.next(val);
    // return this.setInLocal('error', val);
  }

  setRouteErrorMsg(val: string) {
    return this.setInLocal('error', val);
  }

  getErrorMsg(): Observable<any> {
    return this.errMsgSub.asObservable();
    /* const error = this.getFromLocal('error', false);
    localStorage.removeItem('error');
    return error; */
  }

  getRouteErrorMsg() {
    const error = this.getFromLocal('error', false);
    localStorage.removeItem('error');
    return error;
  }

  getValidationErrors(formControl: string, formGroup, validations): string {
    const errorField = validations[formControl];

    for (const i in errorField) {
      if (formGroup.get(formControl).hasError(errorField[i].type)) {
        return errorField[i].message;
      }
    }
  }

  markFieldsAsDirty(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(formControl => {
      const control = formGroup.get(formControl);
      control.markAsDirty({ onlySelf: true });
    });
  }

  showResponseError(error) {
    if (error.status === 422 && error.error.errors) {
      let msg = '';
      const errors = error.error.errors;
      for (let i = 0; i < errors.length; i++) {
        const element = errors[i];
        msg += element.msg;
        if (i !== errors.length - 1) {
          msg += '. ';
        }
      }
      return msg;
    } else if (error.error.message === undefined) {
      return error.status + ' - ' + error.statusText;
    } else {
      return error.error.message;
    }
  }

}
