import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { TestComponent } from './test.component';
import { HomeComponent } from './testAnim/home.component';
import { AboutComponent } from './testAnim/about.component';
import { SlideupModule } from '@app/utils/comp/slideup/slideup.module';

@NgModule({
  declarations: [TestComponent, HomeComponent, AboutComponent],
  imports: [CommonModule, SlideupModule, TestRoutingModule]
})
export class TestModule {}
