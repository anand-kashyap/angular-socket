import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../chat.service';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  loader = false;
  success = false;
  errorMessage: string;
  resetPasswordForm: FormGroup = this.fb.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      token: ['', Validators.required]
    },
    {
      validators: this.validateService.mustMatch('password', 'confirmPassword')
    }
  );
  resetPasswordValidations = {
    password: [
      {
        type: 'required',
        message: 'Password is required'
      },
      {
        type: 'minlength',
        message: 'Password must have a minimum length of 6 characters'
      }
    ],
    confirmPassword: [
      {
        type: 'required',
        message: 'Confirm Password is required'
      },
      {
        type: 'mustMatch',
        message: 'Confirm Password must match Password'
      }
    ]
  };
  constructor(
    private fb: FormBuilder,
    private validateService: ChatService,
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit() {
    const token = this.activatedRoute.snapshot.queryParams.token;
    if (token === undefined || token === '') {
      this.router.navigate(['/forgot-password']);
    } else {
      this.resetPasswordForm.controls.token.setValue(token);
    }
  }

  getErrors(controlName: string) {
    return this.validateService.getErrors(controlName, this.resetPasswordForm, this.resetPasswordValidations);
  }

  isInvalid(controlName: string): boolean {
    return this.validateService.isInvalid(this.resetPasswordForm, controlName);
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      this.loader = true;
      const body = this.resetPasswordForm.value;
      delete body.confirmPassword;
      console.log(body);
      this.resetPasswordForm.disable();
      this.apiService
        .resetPass(body)
        .subscribe(
          res => {
            this.success = res.success;
            this.errorMessage = res.message;
            console.log(res);
            setTimeout(() => {
              this.router.navigateByUrl('/');
            }, 2000);
          },
          err => {
            console.log(err);
            this.errorMessage = this.validateService.showResponseError(err);
            if (this.errorMessage === 'jwt expired') {
              console.log('expired');
              /* setTimeout(() => {
            this.router.navigateByUrl('/forgot-password');
          }, 3000); */
            }
          }
        )
        .add(() => {
          this.loader = false;
          this.resetPasswordForm.enable();
        });
    } else {
      this.validateService.markFieldsAsDirty(this.resetPasswordForm);
    }
  }
}
