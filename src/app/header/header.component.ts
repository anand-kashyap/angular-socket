import { ChatService } from './../chat.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private chatService: ChatService) { }

  ngOnInit() {
  }

  isLoggedIn() {
    return this.chatService.isLoggedIn();
  }

  logout() {
    this.chatService.logout();
  }

}
