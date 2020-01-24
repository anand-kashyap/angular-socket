import { Component, Input, Output, ElementRef, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-pull-refresh',
  styles: [
    `
      :host {
        display: block;
        max-height: 50px;
        overflow: auto;
      }
    `
  ],
  template: `
    <section [hidden]="!inProgress">
      refresh in progress ... (change it by your own loader)
    </section>
    <ng-content></ng-content>
  `
})
export class PullToRefreshComponent {
  private lastScrollTop = 0;
  private isAtTop = false;
  private element;

  @Input() inProgress = false;
  @Output() pulled: EventEmitter<any> = new EventEmitter<any>();

  constructor(el: ElementRef) {
    this.element = el.nativeElement;
  }

  private get scrollTop() {
    return this.element.scrollTop || 0;
  }

  @HostListener('scroll')
  @HostListener('touchmove')
  onScroll() {
    if (this.scrollTop <= 0 && this.lastScrollTop <= 0) {
      if (this.isAtTop) {
        this.pulled.emit(true);
      } else {
        this.isAtTop = true;
      }
    }
    this.lastScrollTop = this.scrollTop;
  }
}
