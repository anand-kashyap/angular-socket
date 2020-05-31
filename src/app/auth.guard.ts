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
    const { isLoggedIn } = this.chatService,
      { checkVerified, checkjoin, checkUsername, checkloggedIn } = next.data;
    let url = '/';
    if (isLoggedIn) {
      const { isVerified, username = '' } = this.chatService.getUserInfo();
      if ((checkVerified && isVerified) || checkloggedIn) {
        url = '/user';
      }
      if (checkjoin && !isVerified) {
        url = '/verify';
      }
      if (checkUsername && !Boolean(username)) {
        url = '/user/update-profile';
      }
      return url === '/' || this.router.parseUrl(url);
    } else {
      return checkloggedIn || this.router.parseUrl(url);
    }
  }
}
