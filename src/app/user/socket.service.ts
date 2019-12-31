import { Router } from '@angular/router';
import { ChatService } from '../chat.service';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

import { environment } from '@env/environment';
import { Observable, Observer } from 'rxjs';

export class Events {
  public static events = {
    NEW_MESSAGE: 'newMessage',
    DEL_MESSAGE: 'deleteMessage',
    NEW_CLIENT: 'newClient',
    LEFT_CLIENT: 'clientLeft'
  };
}
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: SocketIOClient.Socket;
  socketUrl = environment.socketUrl;
  isLoggedIn = false;

  constructor(private chatService: ChatService, private router: Router) {
    this.connectSocket();
  }

  connectSocket() {
    this.socket = io.connect(this.socketUrl);
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

  onSEvent(event: string) {
    return new Observable((observer: Observer<any>) => {
      this.socket.on(event, message => {
        observer.next(message);
      });
    });
  }

  /*  onNewMessage() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('newMessage', (message: { msg: string; username: string; date: Date }) => {
        observer.next(message);
      });
    });
  } */

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
