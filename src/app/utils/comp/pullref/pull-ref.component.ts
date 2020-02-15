import { Component, OnInit, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-pull-ref',
  templateUrl: './pull-ref.component.html',
  styleUrls: ['./pull-ref.component.scss']
})
export class PullRefComponent implements OnInit {
  private lastScrollTop = 0;
  private isAtTop = false;
  private element;

  @Input() inProgress = false;
  @Output() pull = new EventEmitter<any>();

  ngOnInit() {}
  constructor(el: ElementRef) {
    this.element = el.nativeElement;
  }

  private get scrollTop() {
    return this.element.scrollTop || 0;
  }

  @HostListener('touchstart')
  @HostListener('touchmove')
  onScroll() {
    if (this.scrollTop <= 0 && this.lastScrollTop <= 0) {
      if (this.isAtTop) {
        this.pull.emit(true);
      } else {
        this.isAtTop = true;
      }
    }
    this.lastScrollTop = this.scrollTop;
  }
}
