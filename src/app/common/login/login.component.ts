import { ApiService } from '../../api.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { ChatService } from '../../chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  error = false;
  errMsg = '';
  loader = false;
  errTimeout = 4000;
  errorMessage: string;
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', [Validators.required]),
    remember: new FormControl(false)
  });
  loginValidations = {
    email: [
      {
        type: 'required',
        message: 'Username/Email is required'
      },
      {
        type: 'minlength',
        message: 'Username/Email must be atleast 4 characters'
      }
    ],
    password: [
      {
        type: 'required',
        message: 'Password is required'
      }
    ]
  };

  constructor(private chatService: ChatService, private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.errMsg = this.chatService.getRouteErrorMsg();
    if (this.errMsg) {
      this.error = true;
    }
    const l = this.chatService.isLoggedIn();
    console.log(l);

    // this.errorMessage = this.authService.getErrorMessage();
  }

  getErrors(formcontrol: string) {
    return this.chatService.getErrors(formcontrol, this.loginForm, this.loginValidations);
  }

  getInvalidCondition(formControl: string) {
    return this.loginForm.get(formControl).invalid && this.loginForm.get(formControl).dirty;
  }

  login() {
    if (this.loginForm.valid) {
      // console.log(this.loginForm.value);
      // return;
      this.loader = true;
      this.loginForm.disable();
      this.apiService.login(this.loginForm.value).subscribe(
        response => {
          this.loader = false;
          this.loginForm.enable();
          const token = jwt_decode(response.token);
          if (!token.active) {
            this.errorMessage = 'Your account is not active. Please contact admin.';
            return;
          }
          this.chatService.setUserInfo(token);
          if (token.notificationSub === null) {
            this.apiService.setNotify(true); // open notify popup
          }
          this.chatService.setInLocal('token', response.token);
          console.log(token);
          this.router.navigateByUrl('/user');
          /* if (token.isAdmin) {
            if (!token.isVerified) {
              this.router.navigate(['admin/update-password']);
            } else {
              this.router.navigate(['/admin']);
            }
          } else {
            if (!token.isVerified) {
              this.router.navigate(['user/update-password']);
            } else {
            }
          } */
        },
        error => {
          this.loader = false;
          this.loginForm.enable();
          this.errorMessage = this.chatService.showResponseError(error);
        }
      );
    } else {
      this.chatService.markFieldsAsDirty(this.loginForm);
    }
  }
}
