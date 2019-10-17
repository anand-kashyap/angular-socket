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

   connectNewClient(user) {
    console.log('here', this.socket);
    console.log('user', user);
    if (this.socket.disconnected) {
      this.socket.open();
    }
    this.socket.emit('join', user, () => {
      console.log('called');
    });
   }

   sendMessage(key: string, message: string| object = '') { // message or location or logout
    if (this.socket.disconnected) {
      this.socket.open();
    }
    this.socket.emit(key, message);
   }

   onNewMessage() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('newMessage', (msg: string, username: string, date) => {
        observer.next({msg, username, date});
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
    this.sendMessage('logout');
    this.socket.disconnect();
    this.chatService.clearUser();
    this.router.navigate(['/']);
  }
}