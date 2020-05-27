import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { convSlideup } from '@app/animations/slideInOut';

import { fromEvent } from 'rxjs';
import * as Hammer from 'hammerjs';
import { takeUntil, tap, concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  animations: [convSlideup]
})
export class TestComponent implements OnInit, AfterViewInit {
  vals = [];
  archs = [];
  bottom = false;
  toDel = true;
  @ViewChild('t') t: ElementRef;
  constructor() {}

  ngOnInit() {
    this.vals = [
      { id: 1, label: 'one' },
      { id: 2, label: 'two' },
      { id: 3, label: 'three' },
      { id: 4, label: 'four' },
      { id: 5, label: 'fivee' }
    ];
    this.archs = [];
  }

  ngAfterViewInit() {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.t.nativeElement.children.length; i++) {
      const li = this.t.nativeElement.children[i];
      const hammerPan = new Hammer(li);
      fromEvent(hammerPan, 'panstart')
        .pipe(concatMap((stEv: any) => this.divMove(hammerPan, stEv)))
        .subscribe();
    }
  }

  private divMove(hammerPan: HammerManager, stEv: any) {
    return fromEvent(hammerPan, 'panmove').pipe(
      takeUntil(
        fromEvent(hammerPan, 'panend').pipe(
          tap(eEvt => {
            const { deltaX: eX } = eEvt;
            const {
              deltaX: sX,
              additionalEvent: sN,
              target: { id }
            } = stEv;
            const finDif = Math.round(eX - sX);
            // console.log('TestComponent -> ngAfterViewInit -> finDif', finDif, eEvt, stEv);
            if (sN === 'panright' && finDif >= 90) {
              this.vals.splice(id, 1);
              console.log('right swipe', 'delete');
              return;
            } else if (sN === 'panleft' && finDif <= -90) {
              console.log('left swipe');
              const [del] = this.vals.splice(id, 1);
              this.archs.push(del);
              return;
            }
            console.log('do nothing');
            this.vals[id].trans = 0;
          })
        )
      ),
      tap((v: any) => {
        const {
          target: { id },
          deltaX,
          additionalEvent
        } = stEv;
        const { deltaX: cX, additionalEvent: cM } = v;
        const diff = Math.round(cX - deltaX);
        console.log('stev', stEv, v);
        this.vals[id].del = (cM || additionalEvent) === 'panright';
        this.vals[id].trans = diff;
      })
    );
  }
}
