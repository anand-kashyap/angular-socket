import { ChatService } from '../chat.service';
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { formatDate } from '@angular/common';
import { Observable, Subject, fromEvent, BehaviorSubject } from 'rxjs';

import { environment } from '@env/environment';
import { filter, tap, debounceTime, map } from 'rxjs/operators';
import { Events, Room, Message } from '@app/models/main';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  socket: SocketIOClient.Socket;
  user;
  latRoomIndex: number;
  socketUrl = environment.socketUrl;
  rooms$ = new BehaviorSubject<any>({});
  typing$ = new BehaviorSubject<any>({});
  onlineSub = new BehaviorSubject<any>([]);
  loggedIn$ = new Subject<any>();
  constructor(private chatService: ChatService) {
    this.user = chatService.getUserInfo();
  }

  getAllRooms() {
    return this.rooms$;
  }

  connectSocket() {
    return new Observable(obs => {
      this.socket = io.connect(this.socketUrl);
      this.socket.emit('active', this.chatService.getUserInfo().username);
      this.onSEvent(Events.events.ACTIVE).subscribe(
        online => {
          console.log('online users', online);
          obs.next(online);
          this.onlineSub.next(online);
        },
        err => console.error(err)
      );
      this.onNewMessage();
      this.onDelMessage();
      // this.onTyping();
      return () => this.socket.disconnect();
    });
  }

  isLoggedIn(): boolean {
    return this.chatService.isLoggedIn;
  }

  joinRoom(username: string, room: string, otherUsernames: string[]) {
    this.socket.emit(Events.events.JOIN, { username, room, otherUsernames });
  }

  sendMessage(key: string, message: string | object = '') {
    this.socket.emit(key, message, environment.production);
  }

  onSEvent(event: string): Observable<any> {
    return fromEvent(this.socket, event);
  }

  getDate(date = new Date()) {
    return formatDate(new Date(date), 'mediumDate', 'en');
  }

  addDates(room) {
    room.fullDates = room.fullDates || {};
    for (let i = 0; i < room.messages.length; i++) {
      const msg = room.messages[i];
      if (msg.datechange) {
        room.fullDates[this.getDate(msg.datechange)] = true;
        continue;
      }
      const date = this.getDate(msg.createdAt);
      if (!room.fullDates[date]) {
        // if changed date present already
        room.messages.splice(i, 0, { datechange: date });
        room.fullDates[date] = true;
      }
    }
  }

  onNewMessage() {
    this.onSEvent(Events.events.NEW_MESSAGE).subscribe(({ message, roomId }) => {
      console.log(message, roomId);
      const allRooms = this.rooms$.value;
      let firstTime = false;
      const curRoom = allRooms[roomId] || {};
      if (!curRoom.fullDates) {
        firstTime = true;
      }
      curRoom.fullDates = curRoom.fullDates || {};
      curRoom.messages = curRoom.messages || [];
      curRoom.count = curRoom.count || 0;

      if (firstTime) {
        this.addDates(curRoom);
      }
      const date = this.getDate();
      const found = curRoom.fullDates[date];
      if (!found) {
        console.log('adding date..');
        curRoom.messages.push({ datechange: message.createdAt });
        curRoom.fullDates[date] = true;
      }
      curRoom.messages.push(message);
      curRoom.count++;
      console.log('num of messages: ', curRoom.count);
      allRooms[roomId] = curRoom;
      this.latRoomIndex = Object.keys(allRooms).indexOf(roomId);
      // console.log('indeed', Object.keys(allRooms), roomId);
      // allRooms.latRoomId = roomId;
      this.rooms$.next(allRooms);
    });
  }

  onDelMessage() {
    this.onSEvent(Events.events.DEL_MESSAGE).subscribe(({ message: delMessage, roomId }) => {
      console.log(delMessage, roomId);
      const allRooms = this.rooms$.value;
      const curRoom = allRooms[roomId] || {};
      let { count = 0 } = curRoom;
      const { messages = [] } = curRoom;
      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];
        if (msg._id === delMessage._id) {
          console.log('deleted message index', i);
          messages.splice(i, 1);
          count--;
          const last = messages[messages.length - 1];
          if (last.datechange) {
            messages.pop();
            count--;
          }
          console.log('num of messages: ', count);
          /* if (!(this.cdRef as ViewRef).destroyed) {
            this.cdRef.detectChanges();
          } */
          break;
        }
      }
      console.log(allRooms[roomId], messages, count);
      allRooms[roomId].messages = messages;
      allRooms[roomId].count = count;
      this.rooms$.next(allRooms);
    });
  }

  onTyping() {
    this.onSEvent(Events.events.TYPING)
      .pipe(
        filter(({ username }) => this.user.username !== username),
        tap(({ username, roomId }) => {
          const { value: rooms } = this.typing$;
          const room = rooms[roomId] || {};
          room[username] = true;
          rooms[roomId] = room;
          this.typing$.next(rooms);
        }),
        debounceTime(500)
      )
      .subscribe(({ username, roomId }) => {
        const { value: rooms } = this.typing$;
        const room = rooms[roomId] || {};
        delete room[username];
        rooms[roomId] = room;
        this.typing$.next(rooms);
      });
  }

  addRoom(roomId, roomObj) {
    const rooms = this.rooms$.value;
    roomObj.count = roomObj.messages.length;
    rooms[roomId] = roomObj;
    this.rooms$.next(rooms);
  }

  getRoom$(roomId: string) {
    return this.rooms$.pipe(
      filter(rooms => rooms[roomId]),
      map(rooms => rooms[roomId])
    );
  }
}
