import { JoinchatComponent } from './joinchat/joinchat.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatroomComponent } from './chatroom/chatroom.component';

const routes: Routes = [
  {path: '', component: JoinchatComponent},
  {path: 'chat', component: ChatroomComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
