import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }

  clearUser() {
    localStorage.removeItem('user');
  }

  setInLocal(key: string, val: any) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  getFromLocal(key: string, json = true) {
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

  setErrorMsg(val: string) {
    return this.setInLocal('error', val);
  }

  getErrorMsg() {
    return this.getFromLocal('error', false);
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
}
