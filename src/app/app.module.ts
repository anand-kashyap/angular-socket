import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import {
  faCoffee,
  faSearch,
  faEllipsisV,
  faUserCircle,
  faPaperPlane,
  faMapMarkerAlt,
  faFileImage,
  faEye,
  faClone,
  faArrowRight,
  faArrowLeft,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import { HAMMER_GESTURE_CONFIG, HammerGestureConfig, HammerModule } from '@angular/platform-browser';
// import { fa } from '@fortawesome/free-regular-svg-icons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { HeaderComponent } from './common/header/header.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NotifyComponent } from './common/notify/notify.component';

@Injectable()
export class MyHammerConfig extends HammerGestureConfig {
  overrides = {
    pinch: { enable: false },
    rotate: { enable: false },
    press: { time: 500, interval: 700 }
  };
}

@NgModule({
  declarations: [AppComponent, HeaderComponent, NotifyComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    AppRoutingModule,
    HammerModule,
    HttpClientModule,
    ServiceWorkerModule.register('./custom-service-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWithDelay:8000'
    })
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  entryComponents: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIcons(
      faFileImage,
      faCoffee,
      faSearch,
      faEllipsisV,
      faUserCircle,
      faPaperPlane,
      faMapMarkerAlt,
      faEye,
      faArrowRight,
      faArrowLeft,
      faClone,
      faTrashAlt
    );
  }
}
