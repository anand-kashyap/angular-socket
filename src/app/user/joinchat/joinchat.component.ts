import { ChatService } from '../../chat.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { map } from 'rxjs/operators';
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
  userListNew: Array<any> = [];
  recentContacts;
  errMsg;
  errTimeout = 4000;
  username: string;
  errSubscription: Subscription;

  constructor(private router: Router, private chatService: ChatService, private apiService: ApiService) {}

  searchUserNew(text) {
    console.log('innew outsear', text);
    this.loader = true;
    this.apiService
      .getUsersList(text)
      .pipe(map(r => r.data))
      .subscribe(res => {
        // this.userListNew = [...res];
        this.userListNew = res;
        this.loader = false;
        console.log(res);
      });
  }

  ngOnInit() {
    this.userinput = this.errMsg = this.username = '';
    this.error = this.loader = false;
    this.fetchRecent = true;
    this.recentContacts = [];
    this.errSubscription = null;
    this.username = this.chatService.getUserInfo().username;
    if (this.username) {
      this.getRecentChats();
    }
    this.errMsg = this.chatService.getRouteErrorMsg();
    if (this.errMsg) {
      this.error = true;
    }
    this.subscribeError();
  }

  getRecentChats() {
    return this.apiService.getRecentChats().subscribe(
      res => {
        console.log('recent usersList', res);
        this.recentContacts = [...res];
        this.fetchRecent = false;
        // console.log(this.recentContacts);
      },
      err => {
        console.error('err', err);
        this.fetchRecent = false;
        this.chatService.showResponseError(err);
      }
    );
  }
  subscribeError() {
    this.errSubscription = this.chatService.getErrorMsg().subscribe(msg => {
      console.log('msg', msg);
      this.errMsg = msg;
      // if (this.errMsg) {
      this.error = true;
      setTimeout(() => {
        this.error = false;
      }, this.errTimeout);
    });
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

  byMe(msgArr: any[]) {
    const last = msgArr[msgArr.length - 1];
    if (last.username === this.username) {
      return true;
    }
    return false;
  }

  ngOnDestroy() {
    console.log('join destroyed');
    this.errSubscription.unsubscribe();
  }

  joinRoom(userObj) {
    console.log('to', userObj.username);
    // create or open existing room
    this.apiService.findOrCreateRoom(this.username, [userObj.username]).subscribe(
      res => {
        console.log(res);
        this.openChat(res.data);
      },
      err => console.error(err)
    );
  }

  openChat(room) {
    this.chatService.room = room;
    this.router.navigateByUrl(`/user/chat/${room._id}`);
  }
}
