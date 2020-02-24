import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-messages-container',
  templateUrl: './messages-container.component.html',
  styleUrls: ['./messages-container.component.scss']
})
export class MessagesContainerComponent implements OnInit {
  @Input() messages;
  @Input() fileRoot;
  @Input() progress = 0;
  @Input() user;
  @Output() older = new EventEmitter();
  @Output() deleteMsg = new EventEmitter();
  imgPath: string;
  modalRef: BsModalRef;
  hover = [];
  constructor(private modalService: BsModalService) {}

  ngOnInit() {}

  deleteMessage(message) {
    this.deleteMsg.emit(message);
  }

  openModal(template: TemplateRef<any>, imgPath: string) {
    this.imgPath = imgPath;
    this.modalRef = this.modalService.show(template);
  }
}
