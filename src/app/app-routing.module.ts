import { JoinchatComponent } from './user/joinchat/joinchat.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { AuthGuard } from './auth.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

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
