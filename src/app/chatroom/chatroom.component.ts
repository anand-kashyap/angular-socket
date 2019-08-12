import { SocketService } from './../socket.service';
import { ChatService } from './../chat.service';
import { Component, OnInit } from '@angular/core';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit {
  messageForm = new FormGroup({
    message: new FormControl('', [Validators.required])
  });

  loading = false;

  count: string;
  messages = [];
  chatContent = '';
  user;

  constructor(private chatService: ChatService, private router: Router, private socketService: SocketService) {

  }

  ngOnInit() {
    this.user = this.chatService.getUserInfo();
    console.log(this.user);
    this.subscribeSocketEvents();
  }

  sendMessage() {
    if (this.messageForm.valid) {
      this.loading = true;
      const message = this.messageForm.get('message').value;
      console.log(message);
      this.socketService.sendMessage('newMessage', message);
      this.loading = false;
    }
  }

  checkValid() {
    if (!this.messageForm.valid || this.messageForm.get('message').value.trim() === '') {
      return true;
    }
    return false;
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
      this.socketService.sendMessage('sendLocation', {lat, long});
      this.loading = false;
    });
  }

  subscribeSocketEvents() {
    this.socketService.onNewMessage().subscribe(message => {
      this.messages.push(message);
      this.messageForm.reset();
    });
    this.socketService.onNewClient().subscribe((mesg) => {
      const joined = mesg;
      this.messages.push({joined});
    });
    this.socketService.onClientDisconnect().subscribe((mesg) => {
      const left = mesg;
      this.messages.push({left});
    });
  }

  logout() {
    this.socketService.logout();
  }
}
