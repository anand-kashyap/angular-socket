import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatroomComponent } from './chatroom.component';
import { PreloadModule } from '@app/shared/preload.module';
import { RformModule } from '@app/shared/rform.module';
import { Routes, RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RecentDateModule } from '@pipes/recent-date.pipe';
import { SendComponent } from './send/send.component';
import { ScrollTrackerDirective } from '@directives/scrollTracker.directive';
import { MobileMessagesContainerComponent } from './mobile-messages-container/mobile-messages-container.component';
import { MessagesContainerComponent } from './messages-container/messages-container.component';
import { SlideupModule } from '@util/slideup/slideup.module';

const routes: Routes = [{ path: '', component: ChatroomComponent }];

@NgModule({
  declarations: [
    ScrollTrackerDirective,
    ChatroomComponent,
    SendComponent,
    MobileMessagesContainerComponent,
    MessagesContainerComponent
  ],
  imports: [
    CommonModule,
    RecentDateModule,
    RouterModule.forChild(routes),
    ModalModule.forRoot(),
    BsDropdownModule.forRoot(),
    SlideupModule,
    PreloadModule,
    RformModule
  ]
})
export class ChatroomModule {}
