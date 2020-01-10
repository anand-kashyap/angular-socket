import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  longClicked(eve) {
    console.log('Long clicked btn: ', eve);
  }

  tap(eve) {
    console.log('tapped: ', eve);
  }
}
