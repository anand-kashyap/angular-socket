import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SlideupComponent } from './slideup.component';

@NgModule({
  declarations: [SlideupComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [SlideupComponent]
})
export class SlideupModule {}
