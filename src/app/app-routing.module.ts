import { JoinchatComponent } from './joinchat/joinchat.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { ChatroomGuard } from './chatroom.guard';

const routes: Routes = [
  {path: '', component: JoinchatComponent},
  {path: 'chat', component: ChatroomComponent, /* canActivate: [ChatroomGuard] */},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
