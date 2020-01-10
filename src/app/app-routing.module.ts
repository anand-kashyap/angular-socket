import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./common/login/login.module').then(m => m.LoginModule),
    canActivate: [AuthGuard],
    data: { checkloggedIn: true }
  },
  {
    path: 'test',
    loadChildren: () => import('./test/test.module').then(m => m.TestModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./common/register/register.module').then(m => m.RegisterModule),
    canActivate: [AuthGuard],
    data: { checkloggedIn: true }
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./common/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
    canActivate: [AuthGuard],
    data: { checkloggedIn: true }
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./common/reset-password/reset-password.module').then(m => m.ResetPasswordModule),
    canActivate: [AuthGuard],
    data: { checkloggedIn: true }
  },
  {
    path: 'verify',
    loadChildren: () => import('./common/verify-account/verify-account.module').then(m => m.VerifyAccountModule),
    canActivate: [AuthGuard],
    data: { checkVerified: true }
  },
  { path: 'user', loadChildren: () => import('./user/user.module').then(m => m.UserModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
