import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() { }

  setInLocal(key: string, val: any) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  getFromLocal(key: string, json = true) {
    let item = localStorage.getItem(key);
    if (json) {
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

  getValidationErrors(formControl: string, formGroup, validations): string {
    const errorField = validations[formControl];

    for (const i in errorField) {
      if (formGroup.get(formControl).hasError(errorField[i].type)) {
        return errorField[i].message;
      }
    }
  }
}
