import { Component, OnInit } from '@angular/core';
import { merge, Observable, of, Subject } from 'rxjs';

import { SwUpdate, SwPush } from '@angular/service-worker';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { ApiService } from '@app/api.service';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnInit {
  updateAvailable$: Observable<boolean>;
  closed$ = new Subject<void>();
  open;
  constructor(private updates: SwUpdate, private swPush: SwPush, private apiService: ApiService) {
    this.checkForUpdate();
    this.checkNotifSub();
  }

  checkNotifSub() {
    this.apiService.checkNotify().subscribe(
      open => {
        if (open) {
          console.log('showing notif on popup');
          setTimeout(() => {
            this.open = true;
          }, 3000);
        } else {
          console.log('already notif on');
        }
      },
      err => console.error(err)
    );
  }

  checkForUpdate() {
    this.updateAvailable$ = merge(
      of(false),
      this.updates.available.pipe(
        map(() => {
          this.notify(true);
          return true;
        })
      ),
      this.closed$.pipe(
        map(() => {
          this.notify(false);
          return false;
        })
      )
    );
  }

  activateUpdate() {
    if (environment.production) {
      this.updates.activateUpdate().then(() => {
        window.location.reload();
      });
    }
  }

  ngOnInit() {}

  subscribeNotify() {
    this.swPush
      .requestSubscription({
        serverPublicKey: environment.vapid.publicKey
      })
      .then(sub => {
        console.log('sub', sub);
        this.apiService.saveNotifySubs(sub).subscribe(
          res => {
            console.log('stored in db', res);
            this.open = false;
          },
          err => console.error('not stored', err)
        );
      })
      .catch(err => console.error('Could not subscribe to notifications', err));
  }

  notify(val: boolean, update = true) {
    if (!update) {
      this.open = val;
    }
    this.apiService.notifyMethod(val);
  }
}
