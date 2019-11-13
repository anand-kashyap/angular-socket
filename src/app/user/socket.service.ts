import { Router } from '@angular/router';
import { ChatService } from '../chat.service';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

import { environment } from 'src/environments/environment';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: SocketIOClient.Socket;
  socketUrl = environment.socketUrl;
  isLoggedIn = false;

  constructor(private chatService: ChatService, private router: Router) {
    // this.socket = io.connect(this.socketUrl);
    this.connectSocket();
  }

  connectSocket() {
    this.socket = io.connect(this.socketUrl);
  }

  loggedIn(): boolean {
    return this.isLoggedIn;
  }

  connectNewClient(username: string, room: string) {
    console.log('here', this.socket);
    const user = { username, room };
    console.log('user', user);
    /* if (this.socket.disconnected) {
      this.socket.open();
    } */
    this.socket.emit('join', user, () => {
      console.log('called');
    });
  }

  sendMessage(key: string, message: string | object = '') {
    // message or location or logout
    if (this.socket.disconnected) {
      this.socket.open();
    }
    this.socket.emit(key, message);
  }

  onNewMessage() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on(
        'newMessage',
        (message: { msg: string; username: string; date: Date }) => {
          observer.next(message);
        }
      );
    });
  }

  onDeletedMessage() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('deleteMessage', message => {
        observer.next(message);
      });
    });
  }

  onNewClient() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('newClient', (msg: string) => {
        observer.next(msg);
      });
    });
  }

  onClientDisconnect() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('clientLeft', (msg: string) => {
        observer.next(msg);
      });
    });
  }

  logout() {
    this.disconnect();
    this.chatService.clearUser();
    this.router.navigate(['/']);
  }

  disconnect() {
    this.sendMessage('logout');
    this.socket.disconnect();
  }
}
