import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RformModule } from '@app/shared/rform.module';
import { SpinnerModule } from '@util/spinner/spinner.module';

import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password.component';

const routes: Routes = [{ path: '', component: ForgotPasswordComponent }];

@NgModule({
  declarations: [ForgotPasswordComponent],
  imports: [CommonModule, RformModule, SpinnerModule, RouterModule.forChild(routes)]
})
export class ForgotPasswordModule {}
