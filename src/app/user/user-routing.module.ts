import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { UserComponent } from './user.component';
import { AuthGuard } from '../auth.guard';
import { ChatroomGuard } from './chatroom.guard';

const routes: Routes = [
  // { path: '', component: UserComponent },
  { path: '', redirectTo: 'join', pathMatch: 'full' },
  {
    path: 'join',
    loadChildren: () => import('./joinchat/joinchat.module').then(m => m.JoinchatModule),
    canActivate: [AuthGuard],
    data: { checkjoin: true, checkUsername: true }
  },
  {
    path: 'chat/:roomId',
    loadChildren: () => import('./chatroom/chatroom.module').then(m => m.ChatroomModule),
    canActivate: [AuthGuard, ChatroomGuard],
    data: { checkjoin: true, checkUsername: true, state: 'chat-open' }
  },
  {
    path: 'update-profile',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
