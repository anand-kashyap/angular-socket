import { SocketService } from '../socket.service';
import { ChatService } from '../../chat.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewRef } from '@angular/core';
import { formatDate } from '@angular/common';

import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '@app/api.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit, OnDestroy {
  messageForm = new FormGroup({
    message: new FormControl('', [Validators.required])
  });

  fullDates = [];
  loading = false;
  hover = [];

  count: string;
  subscriptions: Subscription[];
  messages = [];
  chatContent = '';
  user;
  room;

  constructor(
    private chatService: ChatService,
    private apiService: ApiService,
    private socketService: SocketService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.user = this.chatService.getUserInfo();
    this.room = this.chatService.getRoom();
    for (let i = 0; i < this.room.messages.length; i++) {
      const msg = this.room.messages[i];
      const date = formatDate(new Date(msg.createdAt), 'mediumDate', 'en');
      if (this.fullDates.indexOf(date) === -1) {
        // if changed date present already
        this.room.messages.splice(i, 0, { datechange: date });
        this.fullDates.push(date);
      }
    }
    this.messages = this.room.messages;
    console.log('messages', this.messages);
    this.socketService.connectNewClient(this.user.username, this.room._id);
    console.log(this.user, 'curRoom', this.room);
    this.subscribeSocketEvents();
  }

  ngOnDestroy() {
    this.socketService.disconnect();
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
    console.log('cleared socket');
  }

  sendMessage() {
    if (this.messageForm.valid) {
      this.loading = true;
      const message = this.messageForm.get('message').value;
      console.log(message);
      this.socketService.sendMessage('newMessage', message);
      this.loading = false;
      // update recent chat observable
      this.apiService.updateRecentChats({ ...this.room }, this.user.username);
    }
  }

  deleteMessage(message) {
    console.log('message to be del', message);
    this.socketService.sendMessage('deleteMessage', message);
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
      this.socketService.sendMessage('sendLocation', { lat, long });
      this.loading = false;
    });
  }

  subscribeSocketEvents() {
    const subs = [];
    subs.push(
      this.socketService.onNewMessage().subscribe(message => {
        console.log(message);
        const date = formatDate(new Date(), 'mediumDate', 'en');
        const found = this.fullDates.indexOf(date);
        if (found === -1) {
          this.messages.push({ datechange: message.createdAt });
          this.fullDates.push(date);
        }
        this.messages.push(message);
        this.messageForm.reset();
      })
    );
    subs.push(
      this.socketService.onDeletedMessage().subscribe(delMessage => {
        for (const index in this.messages) {
          if (this.messages.hasOwnProperty(index)) {
            const i = parseInt(index, 10);
            const msg = this.messages[index];
            if (msg._id === delMessage._id) {
              console.log('deleted message index', i);
              this.messages.splice(i, 1);
              if (!(this.cdRef as ViewRef).destroyed) {
                this.cdRef.detectChanges();
              }
            }
          }
        }
      })
    );
    subs.push(
      this.socketService.onNewClient().subscribe(username => {
        if (this.user.username !== username) {
          const joined = `${username} has joined`;
          this.messages.push({ joined });
        }
      })
    );
    subs.push(
      this.socketService.onClientDisconnect().subscribe(username => {
        if (this.user.username !== username) {
          const left = `${username} has left`;
          this.messages.push({ left });
        }
      })
    );
    this.subscriptions = subs;
  }

  logout() {
    this.socketService.logout();
  }
}
