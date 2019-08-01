import { ChatService } from './../chat.service';
import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable, Observer } from 'rxjs';

import { environment } from 'src/environments/environment';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  messageForm = new FormGroup({
    message: new FormControl('', [])
  });
  socket: SocketIOClient.Socket;
  loading = false;
  socketUrl = environment.socketUrl;
  count: string;
  messages = [];
  chatContent = '';
  constructor(private chatService: ChatService) {
    this.socket = io.connect(this.socketUrl);
  }

  ngOnInit() {
    const user = this.chatService.getUserInfo();
    this.socket.emit('join', user);
    // console.log(user);
    this.subscribeSocketEvents();
  }

  sendMessage() {
    this.loading = true;
    const message = this.messageForm.get('message').value;
    this.socket.emit('newMessage', message);
    this.messageForm.reset();
    this.loading = false;
  }

  onNewMessage() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('newMessage', (msg: string, username: string) => {
        observer.next({msg, username});
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

  subscribeSocketEvents() {
    this.onNewMessage().subscribe(message => {
      console.log(message);
      this.messages.push(message);
    });
    this.onNewClient().subscribe((mesg) => {
      const username = mesg;
      this.messages.push({username});
    });
    this.onClientDisconnect().subscribe((mesg) => {
      const username = mesg;
      this.messages.push({username});
    });
  }
}
