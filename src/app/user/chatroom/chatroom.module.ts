import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatroomComponent } from './chatroom.component';
import { PreloadModule } from '@app/shared/preload.module';
import { RformModule } from '@app/shared/rform.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Routes, RouterModule } from '@angular/router';
import { RecentDatePipe } from '../recent-date.pipe';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

const routes: Routes = [{ path: '', component: ChatroomComponent }];

@NgModule({
  declarations: [ChatroomComponent, RecentDatePipe],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    BsDropdownModule.forRoot(),
    PreloadModule,
    RformModule,
    FontAwesomeModule
  ]
})
export class ChatroomModule {}
