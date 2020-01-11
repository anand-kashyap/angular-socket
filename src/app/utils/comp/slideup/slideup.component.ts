import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
// import { UtilService } from '../util.service';
interface Opt {
  label: string;
  icon?: string;
  color?: string;
}

@Component({
  selector: 'app-slideup',
  templateUrl: './slideup.component.html',
  styleUrls: ['./slideup.component.scss']
})
export class SlideupComponent implements OnInit {
  @Input() open = false;
  @Output() closed = new EventEmitter();
  @Input() opts: Opt[] = [];
  @HostListener('document:click', ['$event'])
  clickout(event) {
    const elId = event.target.getAttribute('id');
    if (elId === 'overlay') {
      this.closed.emit();
    }
  }
  constructor() {}

  ngOnInit() {}

  selectedOption(opt) {
    this.closed.emit(opt);
  }
}
