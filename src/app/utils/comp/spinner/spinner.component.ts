import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent implements OnInit {
  @Input() show = false;
  @Input() block = false;
  @Input() size: string;
  constructor() {}

  ngOnInit(): void {}
}
