import { Router } from '@angular/router';
import { ChatService } from '../chat.service';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

import { environment } from '@env/environment';
import { Observable, Observer, Subject, Subscription, bindCallback } from 'rxjs';

export class Events {
  public static events = {
    NEW_MESSAGE: 'newMessage',
    DEL_MESSAGE: 'deleteMessage',
    NEW_CLIENT: 'newClient',
    TYPING: 'typing',
    LEFT_CLIENT: 'clientLeft',
    LOCATION: 'sendLocation',
    LOADMSGS: 'loadMsgs',
    ACTIVE: 'active'
  };
}
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: SocketIOClient.Socket;
  socketUrl = environment.socketUrl;
  connected;
  onlineUsers: string[];
  onlineSub = new Subject<any>();
  loggedIn$ = new Subject<any>();
  constructor(private chatService: ChatService, private router: Router) {
    // this.connectSocket();
  }

  connectSocket() {
    return new Observable(obs => {
      const socket = io.connect(this.socketUrl);
      socket.emit('active', this.chatService.getUserInfo().username);
      socket.on(Events.events.ACTIVE, online => {
        this.onlineUsers = online;
        console.log('online users', online);
        obs.next(online);
        this.onlineSub.next(online);
      });
      return () => socket.disconnect();
    });
  }

  isLoggedIn(): boolean {
    return this.chatService.isLoggedIn;
  }

  connectNewClient(username: string, room: string) {
    // console.log('socket connected', this.socket);
    const user = { username, room };
    this.socket = io.connect(this.socketUrl);
    return new Promise((res, rej) => {
      this.socket.emit('join', user, online => {
        res(online);
      });
    });
  }

  sendMessage(key: string, message: string | object = '') {
    // message or location or logout
    if (this.socket.disconnected) {
      this.socket.open();
    }
    this.socket.emit(key, message, environment.production);
  }

  onSEvent(event: string): any {
    // const fn = bindCallback(this.socket.on);
    // return fn(event);
    return new Observable((observer: Observer<any>) => {
      const fn = message => {
        observer.next(message);
      };
      this.socket.on(event, fn);
      // this.subs.push({ event, fn });
      // return this.socket.off(event, fn);
    });
  }

  logout() {
    this.disconnect();
    this.chatService.clearUser();
    this.router.navigateByUrl('/');
  }

  disconnect() {
    this.sendMessage('logout');
    this.socket.disconnect();
  }
  leave() {
    this.sendMessage('leave');
    this.socket.disconnect();
  }
}
