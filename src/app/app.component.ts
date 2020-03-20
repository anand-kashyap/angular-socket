import { Component, OnInit } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { routerTransition } from './animations/routerTransition';
import { Router } from '@angular/router';
import { SocketService } from './user/socket.service';
import { Subscription } from 'rxjs';
import { environment } from '@env/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routerTransition]
})
export class AppComponent implements OnInit {
  noPull = false;
  connected: Subscription;
  constructor(private router: Router, private sService: SocketService) {
    setTheme('bs4');
  }

  // todo disconnect active socket on logout
  ngOnInit() {
    this.showConfig();
    this.sService.loggedIn$.subscribe(isActive => {
      if (isActive && !this.connected) {
        this.connected = this.sService.connectSocket().subscribe(onli => console.log(onli));
        console.log('set active');
      } else {
        this.connected.unsubscribe();
        this.connected = null;
        console.log('remove active');
      }
    });
    if (this.sService.isLoggedIn()) {
      this.sService.loggedIn$.next(true);
    }
    this.router.events.subscribe(res => {
      this.noPull = this.router.url.startsWith('/user/chat');
    });
  }

  private showConfig() {
    const css = 'color:#007bff;font-size:0.85rem;font-weight:bold;';
    console.log('%cMaking api calls to: ', css, environment.socketUrl);
    console.log(`%cCurrent app url is: `, css + 'color:orange;', environment.baseUrl);
  }

  getState(outlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.state;
  }

  onPull(r) {
    // console.log(r);
    r.activated.instance.ngOnInit();
  }
}
