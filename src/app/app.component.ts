import { Component, OnInit } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { routerTransition } from './animations/routerTransition';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition]
})
export class AppComponent implements OnInit {
  pullrefHeight: number;
  pullTxt: string;
  constructor() {
    setTheme('bs4');
  }
  ngOnInit() {}

  getState(outlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.state;
  }

  onPull(val) {
    console.log(val);
  }

  pulling(height) {
    if (height > 60) {
      this.pullTxt = 'leave to refresh';
    } else {
      this.pullTxt = 'pull to refresh';
    }
    this.pullrefHeight = height;
  }

  pullComp(success: boolean) {
    console.log('comple', success);

    if (success) {
      this.pullTxt = 'refreshing!';
      setTimeout(() => {
        this.pullrefHeight = 0;
      }, 2000);
    } else {
      this.pullTxt = 'pull to refresh';
      this.pullrefHeight = 0;
    }
  }
}
