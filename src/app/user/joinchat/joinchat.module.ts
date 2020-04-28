import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoinchatComponent } from './joinchat.component';
import { RformModule } from '@app/shared/rform.module';
import { AlertModule } from 'ngx-bootstrap/alert';
import { RecentDateModule } from '@pipes/recent-date.pipe';
// import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { Routes, RouterModule } from '@angular/router';
import { SpinnerModule } from '@util/spinner/spinner.module';

const routes: Routes = [{ path: '', component: JoinchatComponent }];
@NgModule({
  declarations: [JoinchatComponent],
  imports: [
    CommonModule,
    RecentDateModule,
    RformModule,
    SpinnerModule,
    RouterModule.forChild(routes),
    // TypeaheadModule.forRoot(),
    AlertModule.forRoot()
  ]
})
export class JoinchatModule {}
