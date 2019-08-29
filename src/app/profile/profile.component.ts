import { ChatapiService } from './../chatapi.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn } from '@angular/forms';
import { ChatService } from '../chat.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  loader = false;
  errorMessage: string;
  profileForm = new FormGroup(
    {
      username: new FormControl('', [Validators.required, Validators.minLength(5)]),
      email: new FormControl({value: '', disabled: true}, [Validators.required, Validators.email]),
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      lastName: new FormControl('', []),
      /* password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      confirmPassword: new FormControl('', [Validators.required]) */
    },
    {
      validators: [/* this.mustMatch('password', 'confirmPassword'), */ this.uniqueUser('username')]
    }
  );
  profileValidations = {
    username: [
      {
        type: 'required',
        message: 'Username is required'
      },
      {
        type: 'unique',
        message: 'Username already taken'
      },
      {
        type: 'minlength',
        message: 'Username must be atleast 5 characters long'
      }
    ],
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

  constructor(private chatService: ChatService, private chatapiService: ChatapiService, private router: Router) {}

  ngOnInit() {
    this.setUserValues();
  }

  setUserValues() {
    this.chatapiService.getUserDetails().subscribe(res => {
      const controlkeys  = {username: 'username', email: 'email', firstName: 'firstName', lastName: 'lastName'};
      if (res.data.username !== '') {
        this.profileForm.controls[controlkeys.username].setValue(res.data.username);
      }
      this.profileForm.controls[controlkeys.email].setValue(res.data.email);
      this.profileForm.controls[controlkeys.firstName].setValue(res.data.firstName);
      this.profileForm.controls[controlkeys.lastName].setValue(res.data.lastName);
    }, err => {
      console.log(err);
      this.errorMessage = this.chatService.showResponseError(err);
    });
  }

  uniqueUser(userInput: string): ValidatorFn {
    return (formGroup: FormGroup): ValidatorFn => {
      const usernameControl = formGroup.controls[userInput];

      if (usernameControl.errors && !usernameControl.errors.unique) {
        // return if another validator has already found an error on the usernameControl
        return;
      }

      this.chatapiService.checkIfUserExists(usernameControl.value).subscribe(res => {
        // set error on usernameControl if user exists
        if (res.exists ) {
          usernameControl.setErrors({ unique: true });
        } else {
          usernameControl.setErrors(null);
        }
      }, err => console.log(err));
    };
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
    return this.chatService.getValidationErrors(
      formcontrol,
      this.profileForm,
      this.profileValidations
    );
  }

  getInvalidCondition(formControl: string) {
    return (
      this.profileForm.get(formControl).invalid &&
      this.profileForm.get(formControl).dirty
    );
  }

  updateProfile() {
    if (this.profileForm.valid) {
      console.log(this.profileForm.value);
      this.loader = true;
      this.profileForm.disable();
      this.chatapiService.updateProfile(this.profileForm.value).subscribe(
        res => {
          this.loader = false;
          this.profileForm.enable();
          const user = this.chatService.getUserInfo();
          user.username = res.data.username;
          this.chatService.setUserInfo(user);
          this.router.navigate(['/join']);
        },
        error => {
          this.loader = false;
          this.profileForm.enable();
          this.errorMessage = this.chatService.showResponseError(error);
        }
      );
    } else {
      this.chatService.markFieldsAsDirty(this.profileForm);
    }
  }
}
