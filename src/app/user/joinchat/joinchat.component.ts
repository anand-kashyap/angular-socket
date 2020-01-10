import { ChatService } from '../../chat.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-joinchat',
  templateUrl: './joinchat.component.html',
  styleUrls: ['./joinchat.component.scss']
})
export class JoinchatComponent implements OnInit, OnDestroy {
  error = false;
  loader = false;
  userinput: string;
  usersList: Observable<any>;
  recentContacts: Array<any>;
  errMsg = '';
  errTimeout = 4000;
  username: string;
  errSubscription: Subscription;

  constructor(private router: Router, private chatService: ChatService, private apiService: ApiService) {
    this.searchUser();
  }

  searchUser() {
    this.usersList = new Observable((observer: any) => {
      this.loader = true;
      this.apiService
        .getUsersList(this.userinput)
        .subscribe(
          res => {
            console.log('usersList', res);
            observer.next(res.data);
          },
          err => {
            console.error(err);
          }
        )
        .add(() => (this.loader = false));
    });
  }

  ngOnInit() {
    this.username = this.chatService.getUserInfo().username;
    if (this.username) {
      this.apiService.getRecentChats().subscribe(
        res => {
          console.log('recent usersList', res);
          this.recentContacts = [...res];
          // console.log(this.recentContacts);
        },
        err => {
          console.error('err', err);
          this.chatService.showResponseError(err);
        }
      );
    }
    this.errMsg = this.chatService.getRouteErrorMsg();
    if (this.errMsg) {
      this.error = true;
    }
    this.subscribeError();
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

  ngOnDestroy() {
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
