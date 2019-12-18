import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [],
  imports: [FormsModule, ReactiveFormsModule, ButtonsModule.forRoot(), FontAwesomeModule],
  exports: [FormsModule, ReactiveFormsModule, ButtonsModule, FontAwesomeModule]
})
export class RformModule {}
