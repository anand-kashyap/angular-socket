import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../environments/environment';
import { Observable, Observer } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular-socket';
  socket: SocketIOClient.Socket;
  socketUrl = environment.socketUrl;
  count: string;
  messages = [];
  chatContent = '';
  constructor() {
    this.socket = io.connect(this.socketUrl);
  }

  ngOnInit() {
    this.onNewMessage().subscribe(message => {
      console.log(message);
      this.messages.push(message);
    });
  }

  sendMessage(msg) {
    this.socket.emit('newMessage', msg.value);
  }

  onNewMessage() {
    return new Observable((observer: Observer<any>) => {
      this.socket.on('newMessage', msg => {
        observer.next(msg);
      });
    });
  }
}
