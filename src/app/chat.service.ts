import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

import { environment } from '../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = environment.socketUrl;
  // private loggedIn = false;
  private errMsgSub = new Subject<string>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  isLoggedIn() {
    // if (this.loggedIn) { return this.getUserInfo(); }
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
    // this.loggedIn = true;
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
      return;
    } else if (error.error.message === undefined) {
      return error.status + ' - ' + error.statusText;
    } else {
      return error.error.message;
    }
  }

  login(loginInput: any): Observable<any> {
    const loginUrl = this.apiUrl + '/user/authenticate';
    const headers = new HttpHeaders();

    return this.httpClient.post<any>(loginUrl, loginInput, { headers });
  }

  logout() {
    this.clearUser();
    this.router.navigate(['/']);
  }

  register(registerInput: any): Observable<any> {
    const registerUrl = this.apiUrl + '/user/register';
    const headers = new HttpHeaders();

    return this.httpClient.post<any>(registerUrl, registerInput, { headers });
  }

  sendOtp(): Observable<any> {
    const verifyUrl = this.apiUrl + '/user/send-otp';
    const headers = new HttpHeaders();
    /* if (!this.isLoggedIn()) {
      return;
    } */
    const email = this.getUserInfo().email;
    return this.httpClient.post<any>(verifyUrl, {email}, { headers });
  }

  confirmOtp(otpInput: any): Observable<any> {
    const confirmOtpUrl = this.apiUrl + '/user/confirm-otp';
    const headers = new HttpHeaders();
    return this.httpClient.post<any>(confirmOtpUrl, otpInput, { headers });
  }
}
