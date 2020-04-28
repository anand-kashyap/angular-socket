import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatroomComponent } from './chatroom.component';
import { RformModule } from '@app/shared/rform.module';
import { Routes, RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RecentDateModule } from '@pipes/recent-date.pipe';
import { SendComponent } from './send/send.component';
import { ScrollTrackerDirective } from '@directives/scrollTracker.directive';
import { MessagesContainerComponent } from './messages-container/messages-container.component';
import { SlideupModule } from '@util/slideup/slideup.module';
import { ProgressBarModule } from '@util/progress-bar/progress-bar.module';

const routes: Routes = [{ path: '', component: ChatroomComponent }];

@NgModule({
  declarations: [ScrollTrackerDirective, ChatroomComponent, SendComponent, MessagesContainerComponent],
  exports: [MessagesContainerComponent],
  imports: [
    CommonModule,
    RecentDateModule,
    RouterModule.forChild(routes),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    SlideupModule,
    ProgressBarModule,
    RformModule
  ]
})
export class ChatroomModule {}
