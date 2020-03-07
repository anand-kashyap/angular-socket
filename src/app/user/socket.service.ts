import { Router } from '@angular/router';
import { ChatService } from '../chat.service';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

import { environment } from '@env/environment';
import { Observable, Observer, Subject, Subscription } from 'rxjs';

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
  isLoggedIn = false;
  joined = false;
  onlineUsers: string[];
  onlineSub = new Subject<any>();
  constructor(private chatService: ChatService, private router: Router) {
    this.connectSocket();
  }

  connectSocket() {
    this.socket = io.connect(this.socketUrl);
    this.socket.emit('active', this.chatService.getUserInfo().username);
    this.onSEvent(Events.events.ACTIVE).subscribe(online => {
      this.onlineUsers = online;
      console.log('online users', online);
      this.onlineSub.next(online);
    });
  }

  loggedIn(): boolean {
    return this.isLoggedIn;
  }

  connectNewClient(username: string, room: string) {
    console.log('socket connected', this.socket);
    const user = { username, room };
    console.log('user info', user);
    if (this.socket.disconnected) {
      this.connectSocket();
    }
    return new Promise((res, rej) => {
      if (!this.joined) {
        this.joined = true;
        this.socket.emit('join', user, online => {
          res(online);
        });
      } else {
        res(this.onlineUsers);
      }
    });
  }

  sendMessage(key: string, message: string | object = '') {
    // message or location or logout
    if (this.socket.disconnected) {
      this.socket.open();
    }
    this.socket.emit(key, message, environment.production);
  }

  onSEvent(event: string) {
    return new Observable((observer: Observer<any>) => {
      this.socket.on(event, message => {
        observer.next(message);
      });
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
}
