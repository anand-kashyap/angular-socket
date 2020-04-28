import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RformModule } from '@app/shared/rform.module';

import { Routes, RouterModule } from '@angular/router';
import { ResetPasswordComponent } from './reset-password.component';
import { SpinnerModule } from '@util/spinner/spinner.module';

const routes: Routes = [{ path: '', component: ResetPasswordComponent }];

@NgModule({
  declarations: [ResetPasswordComponent],
  imports: [CommonModule, RformModule, SpinnerModule, RouterModule.forChild(routes)]
})
export class ResetPasswordModule {}
