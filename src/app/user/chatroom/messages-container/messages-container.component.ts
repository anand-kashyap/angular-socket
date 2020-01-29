import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-messages-container',
  templateUrl: './messages-container.component.html',
  styleUrls: ['./messages-container.component.scss']
})
export class MessagesContainerComponent implements OnInit {
  @Input() messages;
  @Input() progress = 0;
  @Input() user;
  @Output() older = new EventEmitter();
  @Output() deleteMsg = new EventEmitter();
  hover = [];
  constructor(private sanit: DomSanitizer) {}

  ngOnInit() {}

  deleteMessage(message) {
    this.deleteMsg.emit(message);
  }
}
