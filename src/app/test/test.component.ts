import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { slideInOutAnimation } from '@app/animations/slideInOut';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  animations: [slideInOutAnimation]
})
export class TestComponent implements OnInit, AfterViewInit {
  vals = [
    'one',
    'two',
    'three',
    'four',
    'fivee',
    'one',
    'two',
    'three',
    'four',
    'fivee',
    'one',
    'two',
    'three',
    'four',
    'fivee'
  ];
  bottom = false;
  @ViewChild('t') t: ElementRef;
  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.t.nativeElement.scrollTop = this.t.nativeElement.scrollHeight;
  }

  swit() {
    const rem = this.vals.splice(2, 1);
    console.log(rem);

    this.vals = [rem[0], ...this.vals];
  }
}
