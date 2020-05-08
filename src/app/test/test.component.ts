import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { msgSlideAnimation, parentIf } from '@app/animations/slideInOut';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  animations: [msgSlideAnimation, parentIf]
})
export class TestComponent implements OnInit, AfterViewInit {
  vals = [];
  bottom = false;
  toDel = true;
  @ViewChild('t') t: ElementRef;
  constructor() {}

  ngOnInit() {
    this.vals = ['one', 'two', 'three', 'four', 'fivee', 'one'];
  }

  ngAfterViewInit() {
    this.t.nativeElement.scrollTop = this.t.nativeElement.scrollHeight;
  }

  swit() {
    this.toDel = true;
    this.vals.pop();
  }

  arch() {
    this.toDel = false;
    this.vals.pop();
  }
}
