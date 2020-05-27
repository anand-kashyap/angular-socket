import { Component, OnInit, AfterViewInit, ContentChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import * as Hammer from 'hammerjs';
import { fromEvent } from 'rxjs';
import { concatMap, takeUntil, tap, throttleTime } from 'rxjs/operators';
import { convSlideup } from '@app/animations/slideInOut';

export const enum Actions {
  LEFT,
  RIGHT,
  CANCEL
}

@Component({
  selector: 'app-swipe-actions',
  templateUrl: './swipe-actions.component.html',
  styleUrls: ['./swipe-actions.component.scss'],
  animations: [convSlideup]
})
export class SwipeActionsComponent implements OnInit, AfterViewInit {
  @ContentChild('sbox') sbox: ElementRef;
  @Output() swiped = new EventEmitter<Actions>();
  @Input() threshold = 200;
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
          // el.style.transition = 'transform 1.0s linear 0s';
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
            const { deltaX: eX } = eEvt;
            const { deltaX: sX, additionalEvent: sN } = stEv;
            const finDif = Math.round(eX - sX);
            // console.log('TestComponent -> ngAfterViewInit -> finDif', finDif, eEvt, stEv);
            if (sN === 'panright' && finDif >= this.threshold) {
              console.log('right swipe', 'delete');
              return this.swiped.emit(Actions.RIGHT);
            } else if (sN === 'panleft' && finDif <= -this.threshold) {
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
