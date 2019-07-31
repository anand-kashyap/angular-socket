import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Observer } from 'rxjs';

import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  socket: SocketIOClient.Socket;
  loading = false;
  socketUrl = environment.socketUrl;
  count: string;
  messages = [];
  chatContent = '';
  constructor() {
    this.socket = io.connect(this.socketUrl);
  }

  ngOnInit() {
    this.onNewMessage().subscribe(message => {
      console.log(message);
      this.messages.push(message);
    });
    this.onNewClient().subscribe(() => {
      const msg = '<strong>New User connected</strong>';
      this.messages.push(msg);
    });
    this.onClientDisconnect().subscribe(() => {
      const msg = '<strong>User disconnected</strong>';
      this.messages.push(msg);
    });
  }

  sendMessage(msg) {
    this.loading = true;
    this.socket.emit('newMessage', msg.value);
    this.loading = false;
  }

  onNewMessage() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('newMessage', msg => {
        observer.next(msg);
      });
    });
  }

  onNewClient() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('newClient', () => {
        observer.next('');
      });
    });
  }

  onClientDisconnect() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('clientLeft', () => {
        observer.next('');
      });
    });
  }

  sendLocation() {
    if (!navigator.geolocation) {
      return alert('You browser does not support geolocation');
    }
    this.loading = true;
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      console.log(position);
      this.socket.emit('sendLocation', {lat, long});
      this.loading = false;
    });
  }
}
