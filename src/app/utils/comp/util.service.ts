import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private state = new Subject<boolean>();
  constructor() {}

  openSlideUp() {
    this.state.next(true);
  }

  getState(): Observable<boolean> {
    return this.state.asObservable();
  }
}
