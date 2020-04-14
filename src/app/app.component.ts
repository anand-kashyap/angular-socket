import { Component, OnInit, Inject, Renderer2 } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';
import { RouterAnimations } from './animations/routerTransition';
import { Router, RoutesRecognized, NavigationEnd } from '@angular/router';
import { SocketService } from './user/socket.service';
import { Subscription } from 'rxjs';
import { environment } from '@env/environment';
import { pairwise, map, filter, tap } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [RouterAnimations.routerTransition]
})
export class AppComponent implements OnInit {
  noPull = false;
  connected: Subscription;
  animationState = 1;
  constructor(
    private router: Router,
    private sService: SocketService,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {
    setTheme('bs4');
  }

  // todo disconnect active socket on logout
  ngOnInit() {
    this.showConfig();
    this.sService.loggedIn$.subscribe(isActive => {
      if (isActive && !this.connected) {
        this.connected = this.sService.connectSocket().subscribe();
        // console.log('set active');
      } else {
        this.connected.unsubscribe();
        this.connected = null;
        // console.log('remove active');
      }
    });
    if (this.sService.isLoggedIn()) {
      this.sService.loggedIn$.next(true);
    }
    this.router.events
      .pipe(
        tap(v => {
          if (v instanceof NavigationEnd) {
            this.noPull = this.router.url.startsWith('/user/join');
            if (this.noPull) {
              this.renderer.addClass(this.document.body, 'scrollbe');
            } else {
              this.renderer.removeClass(this.document.body, 'scrollbe');
            }
          }
          return v;
        }),
        filter(v => v instanceof RoutesRecognized),
        pairwise(),
        map(([prev, curr]) => {
          // start and end
          const prevA = prev as any;
          const currA = curr as any;
          const preDep = prevA.urlAfterRedirects === '/' ? 0 : prevA.urlAfterRedirects.split('/').length - 1;
          const curDep = currA.urlAfterRedirects === '/' ? 0 : currA.url.split('/').length - 1;
          let dep = curDep > preDep ? 100 : -100;
          if (dep === this.animationState) {
            dep = Math.sign(dep) === 1 ? dep + 1 : dep - 1;
          }
          this.animationState = dep;
          console.log('prev, curr', prevA.urlAfterRedirects, currA.urlAfterRedirects, this.animationState);
          return {
            oldvalue: prev,
            newvalue: curr,
            params: this.animationState
          };
        })
      )
      .subscribe();
  }

  private showConfig() {
    const css = 'color:#007bff;font-size:0.85rem;font-weight:bold;';
    console.log('%cMaking api calls to: ', css, environment.socketUrl);
    console.log(`%cCurrent app url is: `, css + 'color:orange;', environment.baseUrl);
  }

  onPull(r) {
    // console.log(r);
    r.activated.instance.ngOnInit();
  }
}
