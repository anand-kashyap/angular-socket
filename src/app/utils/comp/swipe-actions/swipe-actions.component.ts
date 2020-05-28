import { Component, OnInit, AfterViewInit, ContentChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import * as Hammer from 'hammerjs';
import { fromEvent } from 'rxjs';
import { concatMap, takeUntil, tap } from 'rxjs/operators';

export const enum Actions {
  LEFT,
  RIGHT,
  CANCEL
}

@Component({
  selector: 'app-swipe-actions',
  templateUrl: './swipe-actions.component.html',
  styleUrls: ['./swipe-actions.component.scss']
})
export class SwipeActionsComponent implements OnInit, AfterViewInit {
  @ContentChild('sbox') sbox: ElementRef;
  @Output() swiped = new EventEmitter<Actions>();
  @Input() threshold = 150;
  del = false;
  trans = 0;
  constructor() {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    const el = this.sbox.nativeElement;
    // console.log('SwipeActionsComponent -> ngAfterViewInit -> el', el);
    const hammerPan = new Hammer(el);
    fromEvent(hammerPan, 'panstart')
      .pipe(
        tap(() => {
          el.style['pointer-events'] = 'none';
        }),
        concatMap((stEv: any) => this.onPanmove(hammerPan, stEv, el))
      )
      .subscribe();
  }

  onPanmove(hammerPan: HammerManager, stEv: any, el: any) {
    return fromEvent(hammerPan, 'panmove').pipe(
      takeUntil(
        fromEvent(hammerPan, 'panend').pipe(
          tap(eEvt => {
            el.style['pointer-events'] = 'auto';
            const { deltaX: eX, overallVelocityX: oX } = eEvt;
            const { deltaX: sX, additionalEvent: sN } = stEv;
            const finDif = Math.round(eX - sX);
            console.log('TestComponent -> ngAfterViewInit -> finDif', finDif, eEvt, stEv);
            if (sN === 'panright' && (finDif >= this.threshold || oX >= 0.2)) {
              console.log('right swipe', 'delete');
              return this.swiped.emit(Actions.RIGHT);
            } else if (sN === 'panleft' && (finDif <= -this.threshold || oX <= -0.2)) {
              console.log('left swipe');
              return this.swiped.emit(Actions.LEFT);
            }
            console.log('do nothing');
            this.trans = 0;
            // el.style.transition = 'none';
            this.swiped.emit(Actions.CANCEL);
          })
        )
      ),
      // throttleTime(200),
      tap((v: any) => {
        const { deltaX, additionalEvent } = stEv;
        const { deltaX: cX, additionalEvent: cM } = v;
        const diff = Math.round(cX - deltaX);
        // console.log('stev', stEv, v);
        this.del = (cM || additionalEvent) === 'panright';
        this.trans = diff;
      })
    );
  }
}
