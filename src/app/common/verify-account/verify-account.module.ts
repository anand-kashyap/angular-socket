import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloadModule } from '@app/shared/preload.module';
import { RformModule } from '@app/shared/rform.module';

import { Routes, RouterModule } from '@angular/router';
import { VerifyAccountComponent } from './verify-account.component';

const routes: Routes = [{ path: '', component: VerifyAccountComponent }];

@NgModule({
  declarations: [VerifyAccountComponent],
  imports: [CommonModule, RformModule, PreloadModule, RouterModule.forChild(routes)]
})
export class VerifyAccountModule {}
