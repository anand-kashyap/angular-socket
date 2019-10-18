import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { RecentDatePipe } from './recent-date.pipe';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { JoinchatComponent } from './joinchat/joinchat.component';
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
    FontAwesomeModule,
    FormsModule, ReactiveFormsModule,
    TypeaheadModule.forRoot(),
    AlertModule.forRoot(),
    UserRoutingModule
  ]
})
export class UserModule { }
