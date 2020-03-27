import { Component, OnInit } from '@angular/core';
import { slideInOutAnimation } from '@app/animations/slideInOut';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  animations: [slideInOutAnimation]
})
export class TestComponent implements OnInit {
  vals = ['one', 'two', 'three', 'four', 'fivee'];
  constructor() {}

  ngOnInit() {}

  swit() {
    const rem = this.vals.splice(2, 1);
    console.log(rem);

    this.vals = [rem[0], ...this.vals];
  }
}
