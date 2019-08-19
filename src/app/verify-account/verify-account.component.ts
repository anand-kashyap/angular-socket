import { Router } from '@angular/router';
import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss']
})
export class VerifyAccountComponent implements OnInit {
  @ViewChild('resendButton', {static: false}) private resendButton: ElementRef;
  errorMessage: string;
  otpSent = false;
  actualOtp: string;
  lastOtpSent: string;
  successMsg: string;
  loader = false;
  isResend = false;
  resendTime = new Date().setMinutes(2, 0, 0);
  verifyForm = new FormGroup({
    otp: new FormControl('', [Validators.required, Validators.minLength(4)])
  });
  verifyValidations = {
    otp: [
      {
        type: 'required',
        message: 'OTP is required'
      },
      {
        type: 'minlength',
        message: 'OTP must be atleast 4 digits'
      }
    ]
  };
  constructor(private chatService: ChatService, private renderer: Renderer2, private router: Router) { }

  ngOnInit() {
    // const nuser = this.chatService.getUserInfo();
    // console.log(nuser);
    // this.chatService.clearUser();
    this.sendOtp();
  }

  setTimer() {
    const timer = setInterval(() => {
      const d = new Date(this.resendTime);
      if (d.getMinutes() === 0 && d.getSeconds() === 1) {
        this.isResend = true;
        // this.resendButton.nativeElement.innerText = 'Resend'; <- never use this
        this.renderer.setProperty(this.resendButton.nativeElement, 'innerText', 'Resend');
        clearInterval(timer);
      }
      this.resendTime = d.setSeconds(d.getSeconds() - 1 );
    }, 1000);
  }

  sendOtp() {
    this.chatService.sendOtp().subscribe(res => {
      this.successMsg = res.message;
      this.actualOtp = res.otp;
      this.lastOtpSent = res.lastVerified;
      this.otpSent = true;
      this.setTimer();
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

  verifyOtp() {
    if (this.verifyForm.valid) {
      if (this.verifyForm.value.otp !== this.actualOtp) {
        this.errorMessage = 'incorrect otp entered';
        return;
      }
      const otpInput = {
        email: this.chatService.getUserInfo().email,
        otp: this.verifyForm.value.otp
      };
      this.chatService.confirmOtp(otpInput).subscribe(res => {
        this.successMsg = 'otp confirmed';
        this.otpSent = false;
        // return setTimeout(() => {
        const user = this.chatService.getUserInfo();
        user.isVerified = true;
        this.chatService.setUserInfo(user);
        this.router.navigateByUrl('/join');
        // }, 1000);
      }, err => {
        this.errorMessage = err.error.message;
      });
    } else {
      this.chatService.markFieldsAsDirty(this.verifyForm);
    }
  }
}
