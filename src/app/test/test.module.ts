import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import { TestComponent } from './test.component';
import { HomeComponent } from './testAnim/home.component';
import { AboutComponent } from './testAnim/about.component';
import { SlideupModule } from '@util/slideup/slideup.module';
import { RformModule } from '@app/shared/rform.module';

@NgModule({
  declarations: [TestComponent, HomeComponent, AboutComponent],
  imports: [CommonModule, RformModule, SlideupModule, TestRoutingModule]
})
export class TestModule {}
