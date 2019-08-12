import { SocketService } from './../socket.service';
import { ChatService } from './../chat.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-joinchat',
  templateUrl: './joinchat.component.html',
  styleUrls: ['./joinchat.component.scss']
})
export class JoinchatComponent implements OnInit, OnDestroy {
  error = false;
  errMsg = '';
  errTimeout = 4000;
  joinFormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    room: new FormControl('one', [Validators.required]),
  });
  errSubscription: Subscription;

  joinValidations = {
    username: [
      {
        type: 'required',
        message: 'User Name is required'
      }
    ],
    room: [
      {
        type: 'required',
        message: 'Room Selection is required'
      }
    ]
  };

  constructor(private chatService: ChatService, private socketService: SocketService) { }

  ngOnInit() {
    this.chatService.clearUser();
    this.errMsg = this.chatService.getRouteErrorMsg();
    if (this.errMsg) {
      this.error = true;
    }
    this.errSubscription = this.chatService.getErrorMsg().subscribe(msg => {
      this.errMsg = msg;
      if (this.errMsg) {
        this.error = true;
        setTimeout(() => {
          this.error = false;
          this.errMsg = '';
        }, this.errTimeout);
      }
    });
  }

  ngOnDestroy() {
    this.errSubscription.unsubscribe();
  }

  joinRoom() {
    if (this.joinFormGroup.valid) {
      const user = this.joinFormGroup.value;
      user.username = user.username.toLowerCase();
      this.chatService.setUserInfo(user);
      this.socketService.connectNewClent(user);
    } else {
      this.chatService.markFieldsAsDirty(this.joinFormGroup);
    }

  }

  getErrors(formcontrol: string) {
    return this.chatService.getValidationErrors(formcontrol, this.joinFormGroup, this.joinValidations);
  }
}
