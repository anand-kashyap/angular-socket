import { SocketService } from './../socket.service';
import { ChatService } from './../chat.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-joinchat',
  templateUrl: './joinchat.component.html',
  styleUrls: ['./joinchat.component.scss']
})
export class JoinchatComponent implements OnInit, OnDestroy {
  error = false;
  errMsg = '';
  errTimeout = 4000;
  username = '';
  joinFormGroup = new FormGroup({
    room: new FormControl('one', [Validators.required]),
  });
  errSubscription: Subscription;

  joinValidations = {
    room: [
      {
        type: 'required',
        message: 'Room Selection is required'
      }
    ]
  };

  constructor(private router: Router, private chatService: ChatService, private socketService: SocketService) {
    // this.socketService.connectSocket();
   }

  ngOnInit() {
    // this.chatService.clearUser();
    this.username = this.chatService.getUserInfo().username;
    console.log(this.username);
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

  joinRoom() {
    if (this.joinFormGroup.valid) {
      const user = this.joinFormGroup.value;
      user.username = this.username;
      this.chatService.setUserInfo(user, true);
      this.socketService.connectNewClient(user);
    } else {
      this.chatService.markFieldsAsDirty(this.joinFormGroup);
    }

  }

  getErrors(formcontrol: string) {
    return this.chatService.getValidationErrors(formcontrol, this.joinFormGroup, this.joinValidations);
  }
}
