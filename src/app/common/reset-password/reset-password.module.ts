import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloadModule } from '@app/shared/preload.module';
import { RformModule } from '@app/shared/rform.module';

import { Routes, RouterModule } from '@angular/router';
import { ResetPasswordComponent } from './reset-password.component';
import { SpinnerModule } from '@util/spinner/spinner.module';

const routes: Routes = [{ path: '', component: ResetPasswordComponent }];

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [CommonModule, RformModule, SpinnerModule, PreloadModule, RouterModule.forChild(routes)]
})
export class ResetPasswordModule {}
