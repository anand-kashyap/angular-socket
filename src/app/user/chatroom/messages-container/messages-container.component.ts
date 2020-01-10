import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-messages-container',
  templateUrl: './messages-container.component.html',
  styleUrls: ['./messages-container.component.scss']
})
export class MessagesContainerComponent implements OnInit {
  @Input() messages;
  @Input() user;
  @Output() older = new EventEmitter();
  @Output() deleteMsg = new EventEmitter();
  hover = [];
  constructor() {}

  ngOnInit() {}

  deleteMessage(message) {
    this.deleteMsg.emit(message);
  }

  loadOlderMsgs(eve) {
    console.log('scrolled', eve);
    // this.older.emit(eve);
  }
}
