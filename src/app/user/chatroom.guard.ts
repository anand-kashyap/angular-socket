import { SocketService } from './socket.service';
import { ChatService } from '../chat.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatroomGuard implements CanActivate {

  constructor(private chatService: ChatService, private router: Router, private socketService: SocketService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const hasUser =  this.chatService.getUserInfo();
    const isLoggedIn = this.socketService.loggedIn();
    // console.log('hasUser');
    if (hasUser && isLoggedIn) {
      return true;
    }
    this.chatService.setRouteErrorMsg('You need to login First!');
    return this.router.parseUrl('/');
  }

}
