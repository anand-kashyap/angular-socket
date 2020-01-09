import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatroomComponent } from './chatroom.component';
import { PreloadModule } from '@app/shared/preload.module';
import { RformModule } from '@app/shared/rform.module';
import { Routes, RouterModule } from '@angular/router';
import { RecentDatePipe } from '../recent-date.pipe';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SendComponent } from './send/send.component';
import { ScrollTrackerDirective } from './directives/scrollTracker.directive';

const routes: Routes = [{ path: '', component: ChatroomComponent }];

@NgModule({
  declarations: [ChatroomComponent, RecentDatePipe, SendComponent, ScrollTrackerDirective],
  imports: [CommonModule, RouterModule.forChild(routes), BsDropdownModule.forRoot(), PreloadModule, RformModule]
})
export class ChatroomModule {}
