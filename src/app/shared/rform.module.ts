import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@NgModule({
  declarations: [],
  imports: [FormsModule, ReactiveFormsModule, ButtonsModule.forRoot()],
  exports: [FormsModule, ReactiveFormsModule, ButtonsModule]
})
export class RformModule {}
