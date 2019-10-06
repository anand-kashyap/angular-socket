import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import { Component, OnInit, /* Renderer2, ElementRef, ViewChild */ } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss']
})
export class VerifyAccountComponent implements OnInit {
  // @ViewChild('resendButton', {static: false}) private resendButton: ElementRef;
  errorMessage: string;
  otpSent = false;
  successMsg: string;
  loader = false;
  isResend = false;
  resendTime = null;
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
  constructor(
    private chatService: ChatService,
    private apiService: ApiService, /* private renderer: Renderer2, */ private router: Router) { }

  ngOnInit() {
    this.sendOtp();
  }

  setTimer() {
    this.resendTime = new Date().setMinutes(2, 0, 0);
    const timer = setInterval(() => {
      const d = new Date(this.resendTime);
      if (d.getMinutes() === 0 && d.getSeconds() === 1) {
        this.isResend = true;
        // this.resendButton.nativeElement.innerText = 'Resend'; <- never use this
        this.resendTime = null;
        // this.renderer.setProperty(this.resendButton.nativeElement, 'innerText', 'Resend');
        clearInterval(timer);
      } else {
        this.resendTime = d.setSeconds(d.getSeconds() - 1 );
      }
    }, 1000);
  }

  sendOtp() {
    this.isResend = false;
    this.apiService.sendOtp().subscribe(res => {
      this.successMsg = res.message;
      this.otpSent = true;
      if (res.attempt < 3) {
        this.setTimer();
      }
    }, err => {
      this.otpSent = true;
      if (err.status === 400) {
        this.resendTime = null;
      } else {
        this.isResend = true;
      }
      this.errorMessage = this.chatService.showResponseError(err);
    });
  }

  getErrors(formcontrol: string) {
    return this.chatService.getErrors(
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
      const otpInput = {
        email: this.chatService.getUserInfo().email,
        otp: this.verifyForm.value.otp
      };
      this.apiService.confirmOtp(otpInput).subscribe(res => {
        this.successMsg = 'otp confirmed';
        this.otpSent = false;
        const user = this.chatService.getUserInfo();
        user.isVerified = true;
        this.chatService.setUserInfo(user);
        this.router.navigateByUrl('/user');
      }, err => {
        this.otpSent = true;
        this.errorMessage = this.chatService.showResponseError(err);
      });
    } else {
      this.chatService.markFieldsAsDirty(this.verifyForm);
    }
  }
}
