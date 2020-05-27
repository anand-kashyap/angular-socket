import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SwipeActionsComponent } from './swipe-actions.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [SwipeActionsComponent],
  exports: [SwipeActionsComponent],
  imports: [CommonModule, FontAwesomeModule]
})
export class SwipeActionsModule {}
