import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModule } from 'ngx-bootstrap/alert';

import { RecentDatePipe } from './recent-date.pipe';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { JoinchatComponent } from './joinchat/joinchat.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ProfileComponent } from './profile/profile.component';

// ng generate module customers --route customer-list --module app.module
@NgModule({
  declarations: [
    RecentDatePipe,
    UserComponent,
    ChatroomComponent,
    JoinchatComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    AlertModule.forRoot(),
    UserRoutingModule
  ]
})
export class UserModule { }
