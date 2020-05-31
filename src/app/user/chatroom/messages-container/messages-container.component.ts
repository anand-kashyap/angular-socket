import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
  ElementRef,
  ViewChild,
  AfterViewInit,
  ViewChildren,
  QueryList
} from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { StateChange } from 'ng-lazyload-image';

@Component({
  selector: 'app-messages-container',
  templateUrl: './messages-container.component.html',
  styleUrls: ['./messages-container.component.scss']
})
export class MessagesContainerComponent implements OnInit, AfterViewInit {
  @Input() messages;
  @Input() fileRoot;
  @Input() bottom = true;
  // @ViewChild('msgC', { read: ElementRef }) msgC: ElementRef;
  @ViewChildren('msgC', { read: ElementRef }) msgC: QueryList<ElementRef>;
  @Input() progress = 0;
  @Input() user;
  @Output() deleteMsg = new EventEmitter();
  open = false;
  isMobile = false;
  selected;
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
  opts;
  imgPath: string;
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) {}

  ngOnInit() {
    this.isMobile = window.screen.width < 768;
  }

  scrollToLast(last) {
    if (last && this.bottom) {
      last.nativeElement.scrollIntoView();
    }
  }

  ngAfterViewInit() {
    const { last } = this.msgC;
    this.scrollToLast(last);
    this.msgC.changes.subscribe(v => {
      this.scrollToLast(v.last);
    });
  }

  deleteMessage(message) {
    this.deleteMsg.emit(message);
  }

  copy(str: string) {
    const listener = (e: ClipboardEvent) => {
      const win = window as any;
      const clipboard = e.clipboardData || win.clipboardData;
      clipboard.setData('text', str.toString());
      e.preventDefault();
    };

    document.addEventListener('copy', listener, false);
    document.execCommand('copy');
    document.removeEventListener('copy', listener, false);
  }
  longPress(msgIndex: number, msg) {
    if (!this.isMobile) {
      return;
    }
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

  onImgErr(e: StateChange, msg) {
    if (e.reason !== 'loading-failed') {
      return;
    }
    msg.noimg = true;
  }

  openModal(template: TemplateRef<any>, imgPath: string) {
    this.imgPath = imgPath;
    this.modalRef = this.modalService.show(template);
  }
}
