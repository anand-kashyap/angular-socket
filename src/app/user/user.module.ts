import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { UserRoutingModule } from './user-routing.module';

// ng generate module customers --route customer-list --module app.module
@NgModule({
  imports: [
    CommonModule,
    // BrowserAnimationsModule,
    UserRoutingModule
  ]
})
export class UserModule {}
