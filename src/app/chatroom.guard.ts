import { ChatService } from './chat.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatroomGuard implements CanActivate {

  constructor(private chatService: ChatService, private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const hasUser =  this.chatService.getUserInfo();
    // console.log('hasUser');
    if (hasUser) {
      return true;
    }
    this.chatService.setErrorMsg('You need to login First!');
    return this.router.parseUrl('/');
  }

}
