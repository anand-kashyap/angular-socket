import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JoinchatComponent } from './joinchat.component';
import { PreloadModule } from '@app/shared/preload.module';
import { RformModule } from '@app/shared/rform.module';
import { AlertModule } from 'ngx-bootstrap/alert';
import { RecentDateModule } from '@pipes/recent-date.pipe';
// import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { Routes, RouterModule } from '@angular/router';
import { AutocompleteModule } from '@util/autocomplete/autocomplete.module';

const routes: Routes = [{ path: '', component: JoinchatComponent }];
@NgModule({
  declarations: [JoinchatComponent],
  imports: [
    CommonModule,
    PreloadModule,
    RecentDateModule,
    RformModule,
    AutocompleteModule,
    RouterModule.forChild(routes),
    // TypeaheadModule.forRoot(),
    AlertModule.forRoot()
  ]
})
export class JoinchatModule {}
