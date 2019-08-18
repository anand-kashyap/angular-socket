import { JoinchatComponent } from './joinchat/joinchat.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { ChatroomGuard } from './chatroom.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyAccountComponent } from './verify-account/verify-account.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'verify', component: VerifyAccountComponent, canActivate: [AuthGuard]},
  {path: 'join', component: JoinchatComponent},
  {path: 'chat', component: ChatroomComponent, canActivate: [ChatroomGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
