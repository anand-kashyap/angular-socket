import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatService } from '../chat.service';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  loader = false;
  errorMessage: string;
  forgotForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required)
  });

  forgotValidations = {
    email: [{
      type: 'required',
      message: 'Email is required'
    }]
  };
  constructor(private chatService: ChatService, private apiService: ApiService) { }

  ngOnInit() {
  }

  isInvalid(control: string) {
    return this.chatService.isInvalid(this.forgotForm, control);
  }

  getErrors(formcontrol: string) {
    return this.chatService.getErrors(
      formcontrol,
      this.forgotForm,
      this.forgotValidations
    );
  }

  sendMail() {
    if (this.forgotForm.valid) {
      const email = this.forgotForm.value.email;
      this.forgotForm.disable();
      this.apiService.forgotPass(email).subscribe(res => {
        this.errorMessage = res.message;
      }, err => this.errorMessage = this.chatService.showResponseError(err)).add(() => {
        this.forgotForm.enable();
      });
    } else {
      this.chatService.markFieldsAsDirty(this.forgotForm);
    }
  }
}
