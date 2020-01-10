import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-mobile-messages-container',
  templateUrl: './mobile-messages-container.component.html',
  styleUrls: ['./mobile-messages-container.component.scss']
})
export class MobileMessagesContainerComponent implements OnInit {
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

  longPress(msgIndex: number) {
    console.log('selected msg is: ', this.messages[msgIndex]);
  }

  loadOlderMsgs(eve) {
    console.log('scrolled', eve);
    // this.older.emit(eve);
  }
}
