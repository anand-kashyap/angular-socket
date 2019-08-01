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
