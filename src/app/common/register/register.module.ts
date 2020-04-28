import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RformModule } from '@app/shared/rform.module';

import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register.component';
import { SpinnerModule } from '@util/spinner/spinner.module';

const routes: Routes = [{ path: '', component: RegisterComponent }];
@NgModule({
  declarations: [RegisterComponent],
  imports: [CommonModule, RformModule, SpinnerModule, RouterModule.forChild(routes)]
})
export class RegisterModule {}
