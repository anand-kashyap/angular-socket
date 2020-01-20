import { Injectable } from '@angular/core';
import { FormGroup, ValidatorFn } from '@angular/forms';
import { Subject, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private errMsgSub = new Subject<string>();
  private proom;
  constructor(private router: Router) {}

  isLoggedIn() {
    return this.getUserInfo() || false;
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

  getUserInfo() {
    return this.getFromLocal('user');
  }

  setUserInfo(val) {
    return this.setInLocal('user', val);
  }

  set room(roomObj) {
    this.proom = roomObj;
  }

  get room() {
    return this.proom;
  }

  gotoJoin() {
    return this.router.navigateByUrl('/user/join');
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

  getErrors(formControl: string, formGroup, validations): string {
    const errorField = validations[formControl];

    for (const i in errorField) {
      if (formGroup.get(formControl).hasError(errorField[i].type)) {
        return errorField[i].message;
      }
    }
  }

  isInvalid(formgroup: FormGroup, formControl: string) {
    return formgroup.get(formControl).invalid && formgroup.get(formControl).dirty;
  }

  markFieldsAsDirty(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(formControl => {
      const control = formGroup.get(formControl);
      control.markAsDirty({ onlySelf: true });
    });
  }

  mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: FormGroup): ValidatorFn => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
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
