import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloadModule } from '@app/shared/preload.module';
import { RformModule } from '@app/shared/rform.module';

import { Routes, RouterModule } from '@angular/router';
import { ResetPasswordComponent } from './reset-password.component';

const routes: Routes = [{ path: '', component: ResetPasswordComponent }];

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [CommonModule, RformModule, PreloadModule, RouterModule.forChild(routes)]
})
export class ResetPasswordModule {}
