import { ChatService } from '../chat.service';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

import { environment } from '@env/environment';
import { Observable, Subject, fromEvent } from 'rxjs';

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
  subs = [];
  onlineUsers = [];
  onlineSub = new Subject<any>();
  loggedIn$ = new Subject<any>();
  constructor(private chatService: ChatService) {}

  connectSocket() {
    return new Observable(obs => {
      this.socket = io.connect(this.socketUrl);
      this.socket.emit('active', this.chatService.getUserInfo().username);
      this.onSEvent(Events.events.ACTIVE).subscribe(
        online => {
          this.onlineUsers = online;
          console.log('online users', online);
          obs.next(online);
          this.onlineSub.next(online);
        },
        err => console.error(err)
      );
      return () => this.socket.disconnect();
    });
  }

  isLoggedIn(): boolean {
    return this.chatService.isLoggedIn;
  }

  connectNewClient(username: string, room: string) {
    // console.log('socket connected', this.socket);
    const user = { username, room };
    this.subs = [];
    // this.socket = io.connect(this.socketUrl);
    return new Promise(res => {
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

  onSEvent(event: string): Observable<any> {
    return fromEvent(this.socket, event);
  }

  leave() {
    this.sendMessage('left');
    console.log('socket', this.socket);
  }
}
