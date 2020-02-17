import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PullToRefreshComponent } from './pull-to-refresh.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [
    PullToRefreshComponent
  ],
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    CommonModule,
    PullToRefreshComponent
  ]
})
export class PullToRefreshModule {

  public static forRoot(environment: any): ModuleWithProviders {

    return {
      ngModule: PullToRefreshModule
    }
  }
}