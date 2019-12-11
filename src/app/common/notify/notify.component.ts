import { Component, OnInit } from '@angular/core';
import { merge, Observable, of, Subject } from 'rxjs';

import { SwUpdate } from '@angular/service-worker';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';

@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.scss']
})
export class NotifyComponent implements OnInit {
  updateAvailable$: Observable<boolean>;
  closed$ = new Subject<void>();

  constructor(private updates: SwUpdate) {
    this.updateAvailable$ = merge(
      of(false),
      this.updates.available.pipe(map(() => true)),
      this.closed$.pipe(map(() => false))
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
}
