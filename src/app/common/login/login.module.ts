import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PreloadModule } from '@app/shared/preload.module';
import { RformModule } from '@app/shared/rform.module';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login.component';
import { AlertModule } from 'ngx-bootstrap/alert';
import { SpinnerModule } from '@util/spinner/spinner.module';

const routes: Routes = [{ path: '', pathMatch: 'full', component: LoginComponent }];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    RformModule,
    SpinnerModule,
    PreloadModule,
    RouterModule.forChild(routes),
    AlertModule.forRoot()
  ]
})
export class LoginModule {}
