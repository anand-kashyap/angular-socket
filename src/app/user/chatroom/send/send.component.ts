import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SocketService, Events } from '@app/user/socket.service';

@Component({
  selector: 'app-send',
  templateUrl: './send.component.html',
  styleUrls: ['./send.component.scss']
})
export class SendComponent implements OnInit {
  messageForm = new FormGroup({
    message: new FormControl('', [Validators.required])
  });
  showSend = false;
  @Input() loading = false;
  @Output() send = new EventEmitter();
  constructor(private socketService: SocketService) {}

  ngOnInit() {}

  onType(inptEl) {
    this.socketService.sendMessage(Events.events.TYPING);
    const msg = inptEl.value;
    if (msg.trim() === '') {
      this.showSend = false;
      return;
    }
    this.showSend = true;
  }

  sendMessage() {
    if (this.messageForm.valid && !this.loading) {
      this.loading = true;
      const message = this.messageForm.get('message').value;
      console.log(message);
      this.socketService.sendMessage(Events.events.NEW_MESSAGE, message);
      this.send.emit();
      this.messageForm.reset();
      this.loading = false;
      this.showSend = false;
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
      this.socketService.sendMessage(Events.events.LOCATION, { lat, long });
      this.loading = false;
    });
  }
}
