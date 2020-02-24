import { Component, OnInit } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { routerTransition } from './animations/routerTransition';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition]
})
export class AppComponent implements OnInit {
  pullrefHeight: number;
  pullTxt: string;
  noPull = false;
  constructor(private router: Router) {
    setTheme('bs4');
  }
  ngOnInit() {
    this.router.events.subscribe((res) => {
      // console.log(this.router.url, "Current URL");
      if (this.router.url.startsWith('/user/chat')) {
        this.noPull = true;
      } else {
        this.noPull = false;
      }
    })
  }

  getState(outlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.state;
  }

  onPull(r) {
    // console.log(r);
    r.activated.instance.ngOnInit();
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
