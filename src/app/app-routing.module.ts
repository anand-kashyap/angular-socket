import { JoinchatComponent } from './user/joinchat/joinchat.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './common/login/login.component';
import { RegisterComponent } from './common/register/register.component';
import { VerifyAccountComponent } from './common/verify-account/verify-account.component';
import { AuthGuard } from './auth.guard';
import { ForgotPasswordComponent } from './common/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './common/reset-password/reset-password.component';

const routes: Routes = [
  {path: '', component: LoginComponent, canActivate: [AuthGuard], data: {checkloggedIn: true}},
  {path: 'register', component: RegisterComponent, canActivate: [AuthGuard], data: {checkloggedIn: true}},
  {path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [AuthGuard], data: {checkloggedIn: true}},
  {path: 'reset-password', component: ResetPasswordComponent, canActivate: [AuthGuard], data: {checkloggedIn: true}},
  {path: 'verify', component: VerifyAccountComponent, canActivate: [AuthGuard], data: {checkVerified: true}},
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
