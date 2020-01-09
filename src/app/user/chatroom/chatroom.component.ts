import { SocketService, Events } from '../socket.service';
import { ChatService } from '@app/chat.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewRef, ViewChild, ElementRef } from '@angular/core';
import { formatDate } from '@angular/common';

import { ApiService } from '@app/api.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit, OnDestroy {
  status = 'away';
  @ViewChild('scrollbox', { static: true }) box: ElementRef<any>;
  fullDates = [];
  loading = false;
  eom = false;
  msgLoading = false;
  hover = [];
  notifyOpen = false;
  typingArr = [];
  lastSeen: string;

  subscriptions: Subscription[];
  messages = [];
  user;
  room;
  title = '';
  bottom = true;
  moreToLoad = 50; // num to get
  count: number;
  constructor(
    private chatService: ChatService,
    private apiService: ApiService,
    private socketService: SocketService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  checkMobile(hovered) {
    if (window.screen.width <= 768) {
      return null;
    }
    return !hovered;
  }

  ngOnInit() {
    this.user = this.chatService.getUserInfo();
    this.room = this.chatService.room;
    this.subscriptions = [
      this.apiService.getNotify().subscribe(opened => {
        this.notifyOpen = opened;
      })
    ];
    if (!this.room) {
      const roomId = this.route.snapshot.params.roomId;
      if (roomId) {
        this.apiService.getRoomById(roomId, this.user.username).subscribe(res => {
          this.room = res.data;
          this.chatService.room = this.room;
          this.count = this.room.messages.length;
          console.log('num of messages: ', this.count);
          this.inits();
        });
      } else {
        return this.chatService.gotoJoin();
      }
    } else {
      this.count = this.room.messages.length;
      console.log('num of messages: ', this.count);
      this.inits();
    }
  }

  addDates() {
    for (let i = 0; i < this.room.messages.length; i++) {
      const msg = this.room.messages[i];
      if (msg.datechange) {
        this.fullDates.push(msg.datechange);
        continue;
      }
      const date = formatDate(new Date(msg.createdAt), 'mediumDate', 'en');
      if (this.fullDates.indexOf(date) === -1) {
        // if changed date present already
        this.room.messages.splice(i, 0, { datechange: date });
        this.fullDates.push(date);
      }
    }
  }

  getLastSeen() {
    // will use more details in future
    this.apiService.getUserByUname(this.title).subscribe(
      res => {
        const { lastSeen } = res.data;
        this.lastSeen = formatDate(new Date(lastSeen), 'MMM d, y, h:mm a', 'en');
      },
      err => {
        console.error('err occured: ', err);
      }
    );
  }

  inits() {
    if (this.room.directMessage) {
      const { members } = this.room;
      this.title = members[0];
      this.getLastSeen();
    }
    this.addDates();
    this.messages = this.room.messages;
    console.log(this.user, 'curRoom', this.room);
    this.socketService.connectNewClient(this.user.username, this.room._id).then((onlineUsers: string[]) => {
      console.log('from croom', onlineUsers);
      this.updateActive([...onlineUsers]);
      this.subscribeSocketEvents();
    });
  }

  ngOnDestroy() {
    this.socketService.disconnect();
    if (this.subscriptions && this.subscriptions.length) {
      for (const sub of this.subscriptions) {
        sub.unsubscribe();
      }
    }
    console.log('cleared socket');
  }

  loadOlderMsgs(pos) {
    // console.log('loading more..', pos);
    if (pos === 'top') {
      this.bottom = false;
      if (!this.eom && !this.msgLoading) {
        const pagin = {
          skip: this.count,
          limit: this.moreToLoad
        };
        this.msgLoading = true;
        this.socketService.sendMessage(Events.events.LOADMSGS, pagin);
      }
    } else {
      this.bottom = true;
    }
  }

  updateActive(onlineUsers: string[]) {
    if (this.room.directMessage) {
      const oId = onlineUsers.indexOf(this.title); // other username
      this.status = oId === -1 ? 'away' : 'active';
    }
  }

  deleteMessage(message) {
    console.log('message to be del', message);
    this.socketService.sendMessage(Events.events.DEL_MESSAGE, message);
  }

  showTyping() {
    this.socketService.sendMessage(Events.events.TYPING);
  }

  sendMessage(msg: string) {
    this.bottom = true;
    this.socketService.sendMessage(Events.events.NEW_MESSAGE, msg);
  }

  sendLocation({ lat, long }) {
    this.socketService.sendMessage(Events.events.LOCATION, { lat, long });
  }

  subscribeSocketEvents() {
    const subs = [];
    const events = Events.events;
    subs.push(
      this.socketService.onSEvent(events.NEW_MESSAGE).subscribe(message => {
        console.log(message);
        const date = formatDate(new Date(), 'mediumDate', 'en');
        const found = this.fullDates.indexOf(date);
        if (found === -1) {
          this.messages.push({ datechange: message.createdAt });
          this.fullDates.push(date);
        }
        this.messages.push(message);
        this.count++;
        console.log('num of messages: ', this.count);
        if (message.username === this.user.username) {
          // update recent chat observable
          this.apiService.updateRecentChats({ ...this.room }, this.user.username);
        }
        this.loading = false;
      })
    );
    subs.push(
      this.socketService.onSEvent(events.DEL_MESSAGE).subscribe(delMessage => {
        for (const index in this.messages) {
          if (this.messages.hasOwnProperty(index)) {
            const i = parseInt(index, 10);
            const msg = this.messages[index];
            if (msg._id === delMessage._id) {
              console.log('deleted message index', i);
              this.messages.splice(i, 1);
              this.count--;
              console.log('num of messages: ', this.count);
              if (!(this.cdRef as ViewRef).destroyed) {
                this.cdRef.detectChanges();
              }
            }
          }
        }
      })
    );
    subs.push(
      this.socketService.onSEvent(events.NEW_CLIENT).subscribe(({ username, onlineUsers }) => {
        this.updateActive(onlineUsers);
        if (this.user.username !== username) {
          console.log('joined', username);
        }
      })
    );
    subs.push(
      this.socketService.onSEvent(events.LOADMSGS).subscribe(({ olderMsgs, count }) => {
        const num = olderMsgs.length;
        if (count <= 0) {
          this.eom = true;
        }
        if (num > 0) {
          let res = this.box.nativeElement.firstElementChild.nextElementSibling;
          const ofset = res.offsetTop - 100;
          if (res.classList.contains('new-day')) {
            // get next if its date change
            res = res.nextElementSibling;
          }
          console.log(res);
          console.log('date is: ', this.fullDates[0]);
          const oldDates = [];
          for (let i = 0; i < num; i++) {
            const msg = olderMsgs[i];
            const date = formatDate(new Date(msg.createdAt), 'mediumDate', 'en');
            if (oldDates.indexOf(date) === -1) {
              // if changed date not present already
              olderMsgs.splice(i, 0, { datechange: date });
              oldDates.push(date);
              // this.fullDates.unshift(date);
            }
          }
          if (oldDates[oldDates.length - 1] === this.fullDates[0]) {
            console.log(this.messages[0]);
            this.messages.splice(0, 1);
            this.fullDates.splice(0, 1);
          }
          this.fullDates = oldDates.concat(this.fullDates);
          this.messages = olderMsgs.concat(this.messages);
          this.box.nativeElement.scrollTop = ofset;
          this.count += olderMsgs.length;
          this.msgLoading = false;
        } else {
          this.msgLoading = false;
        }
      })
    );
    subs.push(
      this.socketService.onSEvent(events.TYPING).subscribe(username => {
        if (this.user.username !== username) {
          const found = this.typingArr.indexOf(username);
          let timer;
          if (found === -1) {
            this.typingArr.push(username);
            timer = setTimeout(() => {
              const olF = this.typingArr.indexOf(username);
              this.typingArr.splice(olF, 1);
            }, 2000);
          } else {
            clearTimeout(timer);
            timer = setTimeout(() => {
              const olF = this.typingArr.indexOf(username);
              this.typingArr.splice(olF, 1);
            }, 2000);
          }
        }
      })
    );
    subs.push(
      this.socketService.onSEvent(events.LEFT_CLIENT).subscribe(({ onlineUsers, left }) => {
        this.updateActive(onlineUsers);
        if (this.user.username !== left) {
          console.log('left', left);
          if (this.room.directMessage) {
            this.lastSeen = formatDate(new Date(), 'MMM d, y, h:mm a', 'en');
          }
        }
      })
    );
    this.subscriptions.concat(subs);
  }
}
