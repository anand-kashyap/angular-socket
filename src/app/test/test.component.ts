import { Component, OnInit } from '@angular/core';
import { slideInOutAnimation } from '@app/animations/slideInOut';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  animations: [slideInOutAnimation]
})
export class TestComponent implements OnInit {
  open = false;
  ngOnInit() {}
  longClicked(eve) {
    console.log('Long clicked btn: ', eve);
  }

  tap(eve) {
    console.log('tapped: ', eve);
  }
}
