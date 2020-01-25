import { Router } from '@angular/router';
import { ChatService } from '../chat.service';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

import { environment } from '@env/environment';
import { Observable, Observer, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
export class Events {
  public static events = {
    NEW_MESSAGE: 'newMessage',
    DEL_MESSAGE: 'deleteMessage',
    NEW_CLIENT: 'newClient',
    TYPING: 'typing',
    LEFT_CLIENT: 'clientLeft',
    LOCATION: 'sendLocation',
    LOADMSGS: 'loadMsgs'
  };
}
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: SocketIOClient.Socket;
  socketUrl = environment.socketUrl;
  username: string;
  subs: Subscription[];
  isLoggedIn = false;
  onlineUsers = new Subject<string[]>();
  onlineUserArr = [];
  connectedSocks = {};
  sendSevent = new Subject();

  constructor(private chatService: ChatService, private router: Router) {
    const { username } = this.chatService.getUserInfo();
    this.username = username;
    console.log('called inst');
    this.connectSocket();
  }

  connectSocket() {
    if (this.username) {
      if (!this.socket) {
        this.socket = io.connect(this.socketUrl, { query: 'username=' + this.username });
        this.subEvents();
      }
    }
  }

  updateOnline(onlineUsers) {
    const curInd = onlineUsers.indexOf(this.username);
    if (curInd !== -1) {
      onlineUsers.splice(curInd, 1);
    }
    this.onlineUserArr = onlineUsers;
    this.onlineUsers.next(onlineUsers);
  }

  subEvents() {
    // ? done to prevent multiple listener everytime
    const evs = Events.events;
    this.socket.once('connected', username => {
      if (this.username === username) {
        for (const key in evs) {
          if (evs.hasOwnProperty(key)) {
            const ev = evs[key];
            this.onSEvent(ev)
              .pipe(debounceTime(100))
              .subscribe(data => {
                console.log('event >>', ev, data);
                if (ev === evs.NEW_CLIENT || ev === evs.LEFT_CLIENT) {
                  this.updateOnline(data.onlineUsers);
                } else {
                  this.sendSevent.next({ event: ev, data });
                }
              });
          }
        }
      }
    });
  }

  loggedIn(): boolean {
    return this.isLoggedIn;
  }

  connectNewClient(room: string) {
    const username = this.username;
    // console.log('socket connected', this.socket);
    const user = { username, room };
    console.log('user info', user);
    if (!this.socket) {
      this.connectSocket();
    }
    if (!this.connectedSocks[room]) {
      console.log('coone join');

      return new Promise((res, rej) => {
        this.socket.emit('join', user, () => {
          this.connectedSocks[room] = true;
          res();
        });
      });
    }
    return Promise.resolve();
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
        return observer.next(message);
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
    // this.socket.disconnect();
  }
}
