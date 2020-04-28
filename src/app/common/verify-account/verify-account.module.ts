import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RformModule } from '@app/shared/rform.module';

import { Routes, RouterModule } from '@angular/router';
import { VerifyAccountComponent } from './verify-account.component';
import { SpinnerModule } from '@util/spinner/spinner.module';

const routes: Routes = [{ path: '', component: VerifyAccountComponent }];

@NgModule({
  declarations: [VerifyAccountComponent],
  imports: [CommonModule, RformModule, SpinnerModule, RouterModule.forChild(routes)]
})
export class VerifyAccountModule {}
