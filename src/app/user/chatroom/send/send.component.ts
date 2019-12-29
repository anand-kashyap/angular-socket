import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit {
  messageForm = new FormGroup({
    message: new FormControl('', [Validators.required])
  });
  @Input() loading = false;
  @Output() send = new EventEmitter();
  @Output() location = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  sendMessage() {
    if (this.messageForm.valid && !this.loading) {
      this.loading = true;
      const message = this.messageForm.get('message').value;
      console.log(message);
      this.send.emit(message);
      this.messageForm.reset();
      this.loading = false;
    }
  }

  checkValid() {
    if (!this.messageForm.valid || this.messageForm.get('message').value.trim() === '') {
      return true;
    }
    return false;
  }

  sendLocation() {
    if (!navigator.geolocation) {
      return alert('You browser does not support geolocation');
    }
    this.loading = true;
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      console.log(position);
      this.location.emit({ lat, long });
      this.loading = false;
    });
  }
}
