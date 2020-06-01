import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SocketService } from '@app/user/socket.service';
import { Events } from '@app/models/main';

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
  @Output() fileUp = new EventEmitter();
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

  sendImage(ev, el) {
    console.log(ev.target.files);
    const [file] = ev.target.files;
    if (file) {
      console.log(file);
      const img = new FormData();
      img.append('file', file, file.name);
      this.fileUp.emit(img);
      el.value = '';
    }
  }

  sendMessage() {
    if (this.messageForm.valid && !this.loading) {
      this.loading = true;
      const msg = this.messageForm.get('message').value;
      console.log(msg);
      this.socketService.sendMessage(Events.events.NEW_MESSAGE, { msg });
      this.send.emit();
      this.messageForm.reset();
      this.loading = this.showSend = false;
    }
  }

  checkValid = () => !!(!this.messageForm.valid || this.messageForm.get('message').value.trim() === '');

  sendLocation() {
    if (!navigator.geolocation) {
      return alert('You browser does not support geolocation');
    }
    this.loading = true;
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude: lat, longitude: long } = position.coords;
      console.log(position);
      this.socketService.sendMessage(Events.events.LOCATION, { lat, long });
      this.loading = false;
    });
  }
}
