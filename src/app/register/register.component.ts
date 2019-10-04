import { ApiService } from '../api.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import jwt_decode from 'jwt-decode';
import { Router } from '@angular/router';
import { ChatService } from './../chat.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  loader = false;
  errorMessage: string;
  registerForm = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      lastName: new FormControl('', []),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      confirmPassword: new FormControl('', [Validators.required])
    },
    {
      validators: this.mustMatch('password', 'confirmPassword')
    }
  );
  registerValidations = {
    email: [
      {
        type: 'required',
        message: 'Email is required'
      },
      {
        type: 'email',
        message: 'Invalid Email'
      }
    ],
    firstName: [
      {
        type: 'required',
        message: 'First Name is required'
      },
      {
        type: 'minlength',
        message: 'First Name must be atleast 3 characters long'
      }
    ],
    password: [
      {
        type: 'required',
        message: 'Password is required'
      },
      {
        type: 'minlength',
        message: 'Password must be atleast 8 characters long'
      }
    ],
    confirmPassword: [
      {
        type: 'required',
        message: 'Confirm Password is required'
      },
      {
        type: 'mustMatch',
        message: 'Password and Confirm Password must match'
      }
    ]
  };

  constructor(private chatService: ChatService, private router: Router, private apiService: ApiService) {}

  ngOnInit() {
  }

  mustMatch(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: FormGroup): ValidatorFn => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  getErrors(formcontrol: string) {
    return this.chatService.getErrors(
      formcontrol,
      this.registerForm,
      this.registerValidations
    );
  }

  getInvalidCondition(formControl: string) {
    return (
      this.registerForm.get(formControl).invalid &&
      this.registerForm.get(formControl).dirty
    );
  }

  register() {
    if (this.registerForm.valid) {
      // return;
      this.loader = true;
      this.registerForm.disable();
      this.apiService.register(this.registerForm.value).subscribe(
        response => {
          this.loader = false;
          this.registerForm.enable();
          const token = jwt_decode(response.token);
          if (!token.active) {
            this.errorMessage =
              'Your account is not active. Please contact admin.';
            return;
          }
          this.chatService.setUserInfo(token);
          this.chatService.setInLocal('token', response.token);
          this.router.navigate(['/verify']);
        },
        error => {
          this.loader = false;
          this.registerForm.enable();
          this.errorMessage = this.chatService.showResponseError(error);
        }
      );
    } else {
      this.chatService.markFieldsAsDirty(this.registerForm);
    }
  }
}
