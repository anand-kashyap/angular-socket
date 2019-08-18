import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss']
})
export class VerifyAccountComponent implements OnInit {
  @ViewChild('resendButton', {static: false}) resendButton: ElementRef;
  errorMessage: string;
  successMsg: string;
  loader = false;
  isResend = false;
  resendTime = new Date().setMinutes(0, 10, 0);
  verifyForm = new FormGroup({
    otp: new FormControl('', [Validators.required, Validators.minLength(4)])
  });
  verifyValidations = [
    {otp: [
      {
        type: 'required',
        message: 'OTP is required'
      },
      {
        type: 'minlength',
        message: 'OTP must be atleast 4 digits'
      }
    ]}
  ];
  constructor(private chatService: ChatService, private renderer: Renderer2) { }

  ngOnInit() {
    // this.sendOtp();
    console.log(this.resendTime);
    const timer = setInterval(() => {
      const d = new Date(this.resendTime);
      if (d.getMinutes() === 0 && d.getSeconds() === 1) {
        this.isResend = true;
        this.resendButton.nativeElement.innerText = 'Resend';
        clearInterval(timer);
      }
      this.resendTime = d.setSeconds(d.getSeconds() - 1 );
    }, 1000);
  }

  sendOtp() {
    this.chatService.sendOtp().subscribe(res => {
      this.successMsg = res.message;
    }, err => {
      this.errorMessage = err.error.message;
    });
  }

  getErrors(formcontrol: string) {
    return this.chatService.getValidationErrors(
      formcontrol,
      this.verifyForm,
      this.verifyValidations
    );
  }

  getInvalidCondition(formControl: string) {
    return (
      this.verifyForm.get(formControl).invalid &&
      this.verifyForm.get(formControl).dirty
    );
  }

  resendOtp() {

  }

  verifyOtp() {

  }

  checkTimer() {

  }
}
