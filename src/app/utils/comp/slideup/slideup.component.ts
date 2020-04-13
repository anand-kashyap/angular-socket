import { Component, OnInit, HostListener, Input, Output, EventEmitter } from '@angular/core';
// import { UtilService } from '../util.service';
import { slideInOutAnimation, parentIf } from '@app/animations/slideInOut';

interface Opt {
  label: string;
  icon?: string;
  color?: string;
}

@Component({
  selector: 'app-slideup',
  templateUrl: './slideup.component.html',
  styleUrls: ['./slideup.component.scss'],
  animations: [parentIf, slideInOutAnimation]
})
export class SlideupComponent implements OnInit {
  @Input() open = false;
  @Output() closed = new EventEmitter();
  @Input() opts: Opt[] = [
    {
      label: 'Copy',
      icon: 'clone'
    },
    {
      label: 'Delete',
      icon: 'trash-alt',
      color: '#f44336'
    }
  ];
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
