import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { UserComponent } from './user.component';
import { JoinchatComponent } from './joinchat/joinchat.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { AuthGuard } from '../auth.guard';
import { ChatroomGuard } from './chatroom.guard';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  // { path: '', component: UserComponent },
  { path: '', redirectTo: 'join', pathMatch: 'full' },
  {
    path: 'join',
    component: JoinchatComponent,
    canActivate: [AuthGuard],
    data: { checkjoin: true, checkUsername: true }
  },
  {
    path: 'chat/:roomId',
    component: ChatroomComponent,
    canActivate: [AuthGuard, ChatroomGuard],
    data: { checkjoin: true, checkUsername: true }
  },
  { path: 'update-profile', component: ProfileComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
