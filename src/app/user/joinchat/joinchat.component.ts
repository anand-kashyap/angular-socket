import { ChatService } from '../../chat.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, noop, pipe } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { map, tap, delay } from 'rxjs/operators';
import { SocketService } from '../socket.service';
@Component({
  selector: 'app-joinchat',
  templateUrl: './joinchat.component.html',
  styleUrls: ['./joinchat.component.scss']
})
export class JoinchatComponent implements OnInit, OnDestroy {
  error;
  loader;
  fetchRecent;
  userinput: string;
  recentContacts;
  errMsg;
  errTimeout = 4000;
  username: string;
  errSubscription: Subscription;
  roomSub: Subscription;

  constructor(
    private router: Router,
    private sService: SocketService,
    private chatService: ChatService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.userinput = this.errMsg = this.username = '';
    this.error = this.loader = false;
    this.recentContacts = []; // todo typing fix
    this.errSubscription = null;
    this.username = this.chatService.getUserInfo().username;
    this.roomSub = this.sService.getAllRooms().subscribe(rooms => {
      const index = this.sService.latRoomIndex;
      const arRooms = Object.values(rooms);
      if (index) {
        const lat = arRooms.splice(index, 1);
        console.log('lat', lat, index, arRooms);
        this.sService.latRoomIndex = null;
        this.recentContacts = [lat[0], ...arRooms];
        return;
      }
      this.recentContacts = arRooms;
    });
    if (this.recentContacts.length < 2) {
      this.fetchRecent = true;
      this.getRecentChats();
    }
    this.errMsg = this.chatService.getRouteErrorMsg();
    if (this.errMsg) {
      this.error = true;
    }
    this.subscribeError();
  }

  getRecentChats() {
    return this.apiService
      .getRecentChats()
      .pipe(
        tap((res: Array<any>) => {
          console.log('recent usersList', res);
          const resJs = res.reduce((json, v) => {
            json[v.id] = v;
            json[v.id].count = v.messages.length;
            return json;
          }, {});
          this.sService.rooms$.next(resJs);
          // console.log(this.recentContacts);
        })
      )
      .subscribe(
        noop,
        err => {
          console.error('err', err);
          this.chatService.showResponseError(err);
        },
        () => (this.fetchRecent = false)
      );
  }
  subscribeError() {
    this.errSubscription = this.chatService
      .getErrorMsg()
      .pipe(
        tap(msg => {
          console.log('msg', msg);
          this.errMsg = msg;
          this.error = true;
        }),
        delay(this.errTimeout)
      )
      .subscribe(() => (this.error = false));
  }

  lastMsg(msgArr: any[]) {
    const last = msgArr[msgArr.length - 1];
    if (last.image) {
      return 'Image';
    }
    if (last.msg.length > 35) {
      return last.msg.slice(0, 35) + '...';
    }
    return last.msg;
  }

  byMe(lastMessage) {
    return lastMessage.username === this.username;
  }

  ngOnDestroy() {
    console.log('join destroyed');
    this.errSubscription.unsubscribe();
    this.roomSub.unsubscribe();
  }

  openChat(room) {
    // this.chatService.room = room;
    this.router.navigateByUrl(`/user/chat/${room.id}`);
  }
}
