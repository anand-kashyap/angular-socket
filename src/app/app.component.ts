import { Component, OnInit, OnDestroy } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { routerTransition } from './animations/routerTransition';
import { Router } from '@angular/router';
import { SocketService } from './user/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition]
})
export class AppComponent implements OnInit, OnDestroy {
  pullrefHeight: number;
  pullTxt: string;
  noPull = false;
  connected: Subscription;
  constructor(private router: Router, private sService: SocketService) {
    setTheme('bs4');
  }
  ngOnInit() {
    if (this.sService.isLoggedIn()) {
      // setactive via socket
      this.connected = this.sService.connectSocket().subscribe(onli => console.log(onli));
      console.log('set active');
    }
    this.router.events.subscribe(res => {
      // console.log(this.router.url, "Current URL");
      this.noPull = this.router.url.startsWith('/user/chat');
    });
  }

  ngOnDestroy() {
    console.log('remove active');
    // tslint:disable-next-line: no-unused-expression
    this.connected && this.connected.unsubscribe();
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
