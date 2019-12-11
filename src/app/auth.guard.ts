import { ChatService } from './chat.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private chatService: ChatService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const loggedIn = this.chatService.isLoggedIn();
    if (loggedIn) {
      if (next.data.checkVerified) {
        const { isVerified } = this.chatService.getUserInfo();
        if (isVerified) {
          return this.router.parseUrl('/user');
        }
      }
      if (next.data.checkjoin) {
        const { isVerified } = this.chatService.getUserInfo();
        if (!isVerified) {
          return this.router.parseUrl('/verify');
        }
      }
      if (next.data.checkUsername) {
        const { username = '' } = this.chatService.getUserInfo();
        if (username === '') {
          return this.router.parseUrl('/user/update-profile');
        }
      }
      if (next.data.checkloggedIn) {
        return this.router.parseUrl('/user');
      }
      return true;
    } else {
      if (next.data.checkloggedIn) {
        return true;
      }
      return this.router.parseUrl('/');
    }
  }
}
