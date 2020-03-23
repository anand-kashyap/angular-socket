import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreloadModule } from '@app/shared/preload.module';
import { RformModule } from '@app/shared/rform.module';

import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register.component';
import { SpinnerModule } from '@util/spinner/spinner.module';

const routes: Routes = [{ path: '', component: RegisterComponent }];
@NgModule({
  declarations: [RegisterComponent],
  imports: [CommonModule, RformModule, SpinnerModule, PreloadModule, RouterModule.forChild(routes)]
})
export class RegisterModule {}
