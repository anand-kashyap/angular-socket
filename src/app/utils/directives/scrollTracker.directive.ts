import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appScrollTracker]'
})
export class ScrollTrackerDirective {
  @Output() loadOld = new EventEmitter();
  @HostListener('scroll', ['$event']) onScroll(event) {
    // Listen to click events in the component
    const el = event.target;
    // const limit = tracker.scrollHeight - tracker.clientHeight;
    // console.log(event.target.scrollTop, event.target.scrollHeight, event.target.offsetHeight);
    if (el.scrollTop === 0) {
      console.log('load more messages if available');
      this.loadOld.emit('top');
      /* setTimeout(() => { // for going to latest msgs
        event.target.scrollTop = event.target.scrollHeight;
      }, 2000); */
    }
    if (el.scrollTop + el.offsetHeight + 1 === el.scrollHeight) {
      this.loadOld.emit('bottom');
    }
  }

  constructor() {}
}
