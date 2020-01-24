import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoinchatComponent } from './joinchat.component';
import { PreloadModule } from '@app/shared/preload.module';
import { RformModule } from '@app/shared/rform.module';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { Routes, RouterModule } from '@angular/router';
import { PullToRefreshModule } from '@util/pullToRefresh/pullToRef.module';

const routes: Routes = [{ path: '', component: JoinchatComponent }];
@NgModule({
  declarations: [JoinchatComponent],
  imports: [
    CommonModule,
    PullToRefreshModule,
    PreloadModule,
    RformModule,
    RouterModule.forChild(routes),
    TypeaheadModule.forRoot(),
    AlertModule.forRoot()
  ]
})
export class JoinchatModule {}
