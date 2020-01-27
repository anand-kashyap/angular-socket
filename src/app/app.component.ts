import { Component, OnInit } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { routerTransition } from './animations/routerTransition';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition]
})
export class AppComponent implements OnInit {
  constructor() {
    setTheme('bs4');
  }
  ngOnInit() {}

  getState(outlet) {
    // if (outlet.activatedRouteData) {
    // console.log(outlet.activatedRouteData.state);
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.state;
    // }
  }
}
