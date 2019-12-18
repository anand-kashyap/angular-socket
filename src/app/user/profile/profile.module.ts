import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { RouterModule, Routes } from '@angular/router';
import { PreloadModule } from '@app/shared/preload.module';
import { RformModule } from '@app/shared/rform.module';
const routes: Routes = [{ path: '', component: ProfileComponent }];

@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, RouterModule.forChild(routes), PreloadModule, RformModule]
})
export class ProfileModule {}
