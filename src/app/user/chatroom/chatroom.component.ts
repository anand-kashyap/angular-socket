import { SocketService } from '../socket.service';
import { ChatService } from '../../chat.service';
import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss'],
})
export class ChatroomComponent implements OnInit {
  messageForm = new FormGroup({
    message: new FormControl('', [Validators.required])
  });

  fullDates = [];
  loading = false;

  count: string;
  messages = [];
  chatContent = '';
  user;
  room;

  constructor(private chatService: ChatService, private router: Router, private socketService: SocketService) {
    // this.socketService.connectSocket();
  }

  ngOnInit() {
    this.user = this.chatService.getUserInfo();
    this.room = this.chatService.getRoom();
    this.socketService.connectNewClient(this.user.username, this.room._id);
    console.log(this.user, this.room);
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
      console.log(this.messages);
      const date = formatDate(new Date(), 'mediumDate', 'en');
      const found = this.fullDates.indexOf(date);
      if (found === -1) {
        this.messages.push({datechange: message.date});
        this.fullDates.push(date);
      }
      this.messages.push(message);
      this.messageForm.reset();
    });
    this.socketService.onNewClient().subscribe((username) => {
      if (this.user.username !== username) {
        const joined = `${username} has joined`;
        this.messages.push({joined});
      }
    });
    this.socketService.onClientDisconnect().subscribe((username) => {
      if (this.user.username !== username) {
        const left = `${username} has left`;
        this.messages.push({left});
      }
    });
  }

  logout() {
    this.socketService.logout();
  }
}
