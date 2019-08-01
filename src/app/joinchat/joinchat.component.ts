import { ChatService } from './../chat.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-joinchat',
  templateUrl: './joinchat.component.html',
  styleUrls: ['./joinchat.component.scss']
})
export class JoinchatComponent implements OnInit {
  error = false;
  errMsg = '';
  errTimeout = '4000';
  joinFormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    room: new FormControl('one', [Validators.required]),
  });

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

  constructor(private router: Router, private chatService: ChatService) { }

  ngOnInit() {
    this.chatService.clearUser();
    this.errMsg = this.chatService.getErrorMsg();
    if (this.errMsg) {
      this.error = true;
    }
  }

  joinRoom() {
    if (this.joinFormGroup.valid) {
      this.chatService.setUserInfo(this.joinFormGroup.value);
      this.router.navigate(['/chat']);
    } else {
      this.chatService.markFieldsAsDirty(this.joinFormGroup);
    }

  }

  getErrors(formcontrol: string) {
    return this.chatService.getValidationErrors(formcontrol, this.joinFormGroup, this.joinValidations);
  }
}
