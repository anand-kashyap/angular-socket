import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Output,
  EventEmitter,
  HostListener
} from '@angular/core';
import { Subscription, fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';

export interface ACOptions {
  // apiTocall: Observable<any>;
  searchLabel?: string;
  helpText?: string;
}
@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss']
})
export class AutocompleteComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() options: ACOptions;
  @Input() dropList: Array<any> = [];
  @Output() getListAsync = new EventEmitter();
  @Output() selectedOption = new EventEmitter();
  searchVal = '';
  selected = 0;
  shouldShowList = false;
  @ViewChild('ref') ref: ElementRef;
  private subscription: Subscription;
  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event']) onfocusOut(e) {
    this.shouldShowList = this.elementRef.nativeElement.contains(e.target);
  }
  ngOnInit() {
    const defOpts = {
      searchLabel: 'Search',
      helpText: ''
    };
    this.options = { ...defOpts, ...this.options };
  }

  ngAfterViewInit() {
    const term$ = fromEvent<any>(this.ref.nativeElement, 'keyup').pipe(
      map(event => {
        const { key } = event;
        if (this.dropList.length > 0) {
          // tslint:disable-next-line
          key === 'ArrowDown' && this.selected < this.dropList.length && this.selected++;
          // tslint:disable-next-line
          key === 'ArrowUp' && this.selected > 1 && this.selected--;
          // tslint:disable-next-line
          if (key === 'Enter' && this.selected > 0) {
            this.selectedOption.emit(this.dropList[this.selected - 1]);
            this.selected = 0;
          }
        }
        return event.target.value;
      }),
      filter(text => {
        const isValid = text.length && text.length > 2;
        if (!isValid) {
          this.shouldShowList = false;
        }
        return isValid;
      }),
      debounceTime(400),
      distinctUntilChanged((prev, curr) => {
        const notChanged = prev === curr;
        this.shouldShowList = curr.length > 2;
        return notChanged;
      })
    );
    this.subscription = term$.subscribe((val: string) => {
      console.log(val);
      this.searchVal = val;
      this.getListAsync.emit(val);
      this.shouldShowList = true;
    });
    this.ref.nativeElement.focus();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getName(obj) {
    const { fullName, username } = obj;
    // todo regex bold
    return `${fullName} (${username})`;
  }
}
