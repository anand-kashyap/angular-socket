import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appPullref]'
})
export class PullrefDirective {
  started = false;
  startPoint = 0;
  endPoint = 0;
  @Output() pulling = new EventEmitter<number>();
  @Output() pullComplete = new EventEmitter<boolean>();
  @HostListener('touchstart', ['$event'])
  touchstart(ev) {
    if (this.started) {
      return;
    }
    this.started = true;
    this.startPoint = ev.touches[0].clientY;
    console.log('st', this.startPoint);
  }
  @HostListener('touchend', ['$event'])
  touchend(ev) {
    // console.log('en', ev.changedTouches[0].clientY);
    this.endPoint = ev.changedTouches[0].clientY;
    // if (this.startPoint === this.endPoint) {
    // tap, do nothing
    //   return;
    // }
    const diff = Math.floor(this.endPoint - this.startPoint);
    this.startPoint = this.endPoint = 0;
    this.started = false;
    console.log(diff);

    if (diff > 60) {
      this.pullComplete.emit(true);
    } else {
      this.pullComplete.emit(false);
    }
  }
  @HostListener('touchmove', ['$event'])
  touchmove(ev) {
    let cur = Math.floor(ev.touches[0].clientY);
    // console.log('mv', cur);
    if (cur < 0) {
      cur = 0;
    }
    const diff = Math.floor(cur - this.startPoint);
    // console.log('height prop', diff);
    this.pulling.emit(diff);
    /* if (this.scrollTop <= 0 && this.lastScrollTop <= 0) {
      if (this.isAtTop) {
        this.pull.emit(true);
      } else {
        this.isAtTop = true;
      }
    }
    this.lastScrollTop = this.scrollTop; */
  }
}
