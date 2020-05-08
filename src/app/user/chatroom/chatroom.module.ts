import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { RformModule } from '@app/shared/rform.module';
import { ScrollTrackerDirective } from '@directives/scrollTracker.directive';
import { RecentDateModule } from '@pipes/recent-date.pipe';
import { ProgressBarModule } from '@util/progress-bar/progress-bar.module';
import { SlideupModule } from '@util/slideup/slideup.module';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ChatroomComponent } from './chatroom.component';
import { MessagesContainerComponent } from './messages-container/messages-container.component';
import { SendComponent } from './send/send.component';

const routes: Routes = [{ path: '', component: ChatroomComponent }];

@NgModule({
  declarations: [ScrollTrackerDirective, ChatroomComponent, SendComponent, MessagesContainerComponent],
  exports: [MessagesContainerComponent],
  imports: [
    CommonModule,
    LazyLoadImageModule,
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
