import { SocketService } from '../socket.service';
import { Events } from '@app/models/main';
import { ChatService } from '@app/chat.service';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { formatDate } from '@angular/common';

import { ApiService } from '@app/api.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { environment } from '@env/environment';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit, OnDestroy {
  status = 'away';
  fileRoot = environment.socketUrl + '/uploads/';
  progress = 0;
  @ViewChild('scrollbox', { static: true }) box: ElementRef<any>;
  loading = false;
  eom = false;
  mobile = false;
  msgLoading = false;
  notifyOpen = false;
  typingJs = {};
  lastSeen: string;

  subscriptions: Subscription[];
  messages = [];
  user;
  room;
  title = '';
  bottom = false;
  moreToLoad = 50; // num to get
  // count: number;
  constructor(
    private chatService: ChatService,
    private apiService: ApiService,
    private socketService: SocketService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.user = this.chatService.getUserInfo();
    this.subscriptions = [
      this.apiService.getNotify().subscribe(opened => {
        this.notifyOpen = opened;
      })
    ];
    const { roomId } = this.route.snapshot.params;
    if (roomId) {
      this.socketService.getRoom$(roomId).subscribe(room => {
        this.room = room;
        this.cdRef.detectChanges();
      });
      if (!this.room) {
        const { data } = await this.apiService
          .getRoomById(roomId, this.user.username)
          .toPromise()
          .catch(e => console.error(e));
        this.room = data;
        this.socketService.addRoom(roomId, this.room);
      }
      console.log('room messages: ', this.room);
      this.inits();
    } else {
      return this.chatService.gotoJoin();
    }
  }

  getLastSeen(first = false) {
    // will use more details in future
    if (first && this.status === 'active') {
      return;
    }
    this.apiService.getUserByUname(this.title).subscribe(
      res => {
        const { lastSeen } = res.data;
        if (lastSeen) {
          this.lastSeen = this.getLastSeenDate(lastSeen);
        }
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
      this.getLastSeen(true);
    }
    this.socketService.addDates(this.room);
    this.messages = this.room.messages;
    setTimeout(() => {
      this.bottom = true;
    }, 0);
    // this.cdRef.detectChanges();
    console.log('curRoom', this.room);
    this.socketService.joinRoom(this.user.username, this.room.id, this.room.members);
    this.subscribeSocketEvents();
  }

  ngOnDestroy() {
    console.log('clearing socket');
    for (const sub of this.subscriptions) {
      sub.unsubscribe();
    }
  }

  loadOlderMsgs(pos) {
    // console.log('loading more..', pos);
    if (pos === 'top') {
      this.bottom = false;
      if (!this.eom && !this.msgLoading) {
        const pagin = {
          skip: this.room.count,
          limit: this.moreToLoad
        };
        this.msgLoading = true;
        this.socketService.sendMessage(Events.events.LOADMSGS, pagin);
      }
    } else if (pos === 'bottom') {
      this.bottom = true;
    }
  }

  fileUpload(file: FormData) {
    this.loading = true;
    this.apiService.uploadFile(file).subscribe(
      (res: HttpEvent<any>) => {
        if (res.type === HttpEventType.UploadProgress) {
          this.progress = Math.round((res.loaded / res.total) * 100);
          this.cdRef.detectChanges();
          console.log(`Uploaded! ${this.progress}%`);
        }
        if (res.type === HttpEventType.Response) {
          console.log(res);
          this.loading = false;
          setTimeout(() => {
            this.progress = 0;
            this.cdRef.detectChanges();
            this.socketService.sendMessage(Events.events.NEW_MESSAGE, { image: res.body.filename });
          }, 200);
        }
      },
      err => console.error(err)
    );
  }

  getLastSeenDate(date = new Date()) {
    return formatDate(new Date(date), 'MMM d, y, h:mm a', 'en');
  }
  updateActive(onlineUsers: string[]) {
    if (this.room.directMessage) {
      const oId = onlineUsers.indexOf(this.title); // other username
      if (oId === -1) {
        this.status = 'away';
        this.lastSeen = this.getLastSeenDate();
        return;
      }
      this.status = 'active';
    }
  }

  deleteMessage(message) {
    console.log('message to be del', message);
    this.socketService.sendMessage(Events.events.DEL_MESSAGE, message);
    // this.bottom = false;
  }

  sendMessage() {
    this.bottom = true;
  }

  getTypingArr() {
    return Object.keys(this.typingJs);
  }

  subscribeSocketEvents() {
    const { events } = Events;
    const { username: uname } = this.user;
    const subs = [
      this.socketService.onlineSub.subscribe(onlineUsers => {
        console.log('oinlin', onlineUsers);
        this.updateActive(onlineUsers);
      }),
      this.socketService.onSEvent(events.LOADMSGS).subscribe(({ olderMsgs, count, username }) => {
        return;
        /* if (uname !== username) {
          return;
        }
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
          // console.log(res);
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
        } */
      })
    ];
    this.subscriptions.push(...subs);
  }
}
