import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { hmrBootstrap } from './hmr';
import { setLogLevel } from 'webpack/hot/log';
setLogLevel('none');
if (environment.production) {
  enableProdMode();
}

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);

if (environment.hmr) {
  if ((module as any).hot) {
    hmrBootstrap(module as any, bootstrap);
  } else {
    console.error('HMR is not enabled for webpack-dev-server!');
    console.log('Are you using the --hmr flag for ng serve?');
  }
} else {
  bootstrap()
    .then(() => {
      if ('serviceWorker' in navigator && environment.production) {
        navigator.serviceWorker.register('./ngsw-worker.js');
      }
    })
    .catch(err => console.log(err));
}
