import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pull-ref',
  templateUrl: './pull-ref.component.html',
  styleUrls: ['./pull-ref.component.scss']
})
export class PullRefComponent implements OnInit {
  @Input() inProgress = false;
  @Input() height = 0;
  @Input() txt = 'pull to refresh';
  @Output() pull = new EventEmitter<any>();

  ngOnInit() {}

  heightChange() {
    return this.height + 'px';
  }
}
