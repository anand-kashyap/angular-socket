import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { RouterModule, Routes } from '@angular/router';
import { RformModule } from '@app/shared/rform.module';
import { SpinnerModule } from '@util/spinner/spinner.module';

const routes: Routes = [{ path: '', component: ProfileComponent }];

@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, RouterModule.forChild(routes), SpinnerModule, RformModule]
})
export class ProfileModule {}
