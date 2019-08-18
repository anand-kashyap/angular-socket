import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { JoinchatComponent } from './joinchat/joinchat.component';
import { RecentDatePipe } from './recent-date.pipe';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { VerifyAccountComponent } from './verify-account/verify-account.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatroomComponent,
    JoinchatComponent,
    RecentDatePipe,
    RegisterComponent,
    LoginComponent,
    VerifyAccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    ModalModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
