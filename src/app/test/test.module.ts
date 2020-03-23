import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { TestComponent } from './test.component';
import { HomeComponent } from './testAnim/home.component';
import { AboutComponent } from './testAnim/about.component';
import { RformModule } from '@app/shared/rform.module';
import { ChatroomModule } from '../user/chatroom/chatroom.module';

@NgModule({
  declarations: [TestComponent, HomeComponent, AboutComponent],
  imports: [CommonModule, RformModule, TestRoutingModule, ChatroomModule]
})
export class TestModule {}
