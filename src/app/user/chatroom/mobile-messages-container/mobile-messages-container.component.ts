import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { slideInOutAnimation } from '@app/animations/slideInOut';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-mobile-messages-container',
  templateUrl: './mobile-messages-container.component.html',
  styleUrls: ['../messages-container/messages-container.component.scss', './mobile-messages-container.component.scss'],
  animations: [slideInOutAnimation]
})
export class MobileMessagesContainerComponent implements OnInit {
  @Input() messages;
  @Input() fileRoot;
  @Input() progress = 0;
  @Input() user;
  @Output() older = new EventEmitter();
  @Output() deleteMsg = new EventEmitter();
  selected;
  open = false;
  allOpts = [
    {
      label: 'Copy',
      icon: 'clone',
      func: () => {
        this.copy(this.selected.msg);
      }
    },
    {
      label: 'Delete',
      icon: 'trash-alt',
      color: '#f44336',
      func: () => {
        this.deleteMsg.emit(this.selected);
      }
    }
  ];
  modalRef: BsModalRef;
  opts;
  imgPath: string;
  hover = [];
  constructor(private modalService: BsModalService) {}

  ngOnInit() {}

  longPress(msgIndex: number, msg) {
    console.log('selected msg is: ', this.messages[msgIndex]);
    navigator.vibrate(18);
    this.opts = [...this.allOpts];
    if (msg.username !== this.user.username) {
      this.opts.splice(1, 1);
    }
    this.open = true;
    this.selected = msg;
  }

  closeSlideup(opt: string) {
    if (opt) {
      console.log('selected opt: ', opt, this.selected);
      for (const op of this.opts) {
        if (op.func && op.label === opt) {
          console.log('call function of: ', op);
          op.func.call(this.opts);
        }
      }
    }
    this.open = false;
  }

  copy(str: string) {
    const listener = (e: ClipboardEvent) => {
      const clipboard = e.clipboardData || window['clipboardData'];
      clipboard.setData('text', str.toString());
      e.preventDefault();
    };

    document.addEventListener('copy', listener, false);
    document.execCommand('copy');
    document.removeEventListener('copy', listener, false);
  }

  openModal(template: TemplateRef<any>, imgPath: string) {
    this.imgPath = imgPath;
    this.modalRef = this.modalService.show(template);
  }
}
