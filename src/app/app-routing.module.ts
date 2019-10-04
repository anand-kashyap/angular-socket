import { JoinchatComponent } from './joinchat/joinchat.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { ChatroomGuard } from './chatroom.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { AuthGuard } from './auth.guard';
import { ProfileComponent } from './profile/profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {path: '', component: LoginComponent, canActivate: [AuthGuard], data: {checkloggedIn: true}},
  {path: 'register', component: RegisterComponent, canActivate: [AuthGuard], data: {checkloggedIn: true}},
  {path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [AuthGuard], data: {checkloggedIn: true}},
  {path: 'reset-password', component: ResetPasswordComponent, canActivate: [AuthGuard], data: {checkloggedIn: true}},
  {path: 'verify', component: VerifyAccountComponent, canActivate: [AuthGuard], data: {checkVerified: true}},
  {path: 'update-profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'join', component: JoinchatComponent, canActivate: [AuthGuard], data: {checkjoin: true, checkUsername: true}},
  {path: 'chat', component: ChatroomComponent, canActivate: [AuthGuard, ChatroomGuard], data: {checkjoin: true, checkUsername: true}},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
