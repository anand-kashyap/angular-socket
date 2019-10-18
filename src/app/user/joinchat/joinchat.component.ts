import { ChatService } from '../../chat.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
  errMsg = '';
  errTimeout = 4000;
  username: string;
  errSubscription: Subscription;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private apiService: ApiService
    ) {
    this.usersList = new Observable((observer: any) => {
      this.loader = true;
      this.apiService.getUsersList(this.userinput).subscribe(res => {
        console.log(res);
        observer.next(res.data);
      },
      err => console.error(err)
      ).add(() => this.loader = false);
    });
   }

  ngOnInit() {
    this.username = this.chatService.getUserInfo().username;
    this.errMsg = this.chatService.getRouteErrorMsg();
    if (this.errMsg) {
      this.error = true;
    }
    this.errSubscription = this.chatService.getErrorMsg().subscribe(msg => {
      console.log('msg', msg);

      this.errMsg = msg;
      // if (this.errMsg) {
      this.error = true;
      setTimeout(() => {
        this.error = false;
      }, this.errTimeout);
      // }
    });
  }

  ngOnDestroy() {
    this.errSubscription.unsubscribe();
  }

  joinRoom(userObj) {
    console.log('to', userObj.username);
    // create or open existing room
    this.apiService.findOrCreateRoom([this.username, userObj.username])
    .subscribe(
      res => {
        console.log(res);
      },
      err => console.error(err)
    );
    return;
    this.chatService.setUserInfo(userObj, true);
    this.router.navigate(['/user/chat']);
  }
}
