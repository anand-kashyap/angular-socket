import { NgModule } from '@angular/core';
import { Routes, RouterModule, RouteReuseStrategy } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { CustomReuse } from './CustomReuse';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./common/login/login.module').then(m => m.LoginModule),
    canActivate: [AuthGuard],
    data: { checkloggedIn: true, state: 'root-login' }
  },
  {
    path: 'test',
    loadChildren: () => import('./test/test.module').then(m => m.TestModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./common/register/register.module').then(m => m.RegisterModule),
    canActivate: [AuthGuard],
    data: { checkloggedIn: true, state: 'root-register' }
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./common/forgot-password/forgot-password.module').then(m => m.ForgotPasswordModule),
    canActivate: [AuthGuard],
    data: { checkloggedIn: true, state: 'root-forgot' }
  },
  {
    path: 'reset-password',
    loadChildren: () => import('./common/reset-password/reset-password.module').then(m => m.ResetPasswordModule),
    canActivate: [AuthGuard],
    data: { checkloggedIn: true, state: 'root-reset' }
  },
  {
    path: 'verify',
    loadChildren: () => import('./common/verify-account/verify-account.module').then(m => m.VerifyAccountModule),
    canActivate: [AuthGuard],
    data: { checkVerified: true, state: 'root-verify' }
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule)
    // data: { state: 'root-user' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomReuse
    }
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
