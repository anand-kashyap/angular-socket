import { ChatapiService } from './../chatapi.service';
import { ChatService } from './../chat.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private chatService: ChatService, private chatapiService: ChatapiService) { }

  ngOnInit() {
  }

  isLoggedIn() {
    return this.chatService.isLoggedIn();
  }

  logout() {
    this.chatapiService.logout();
  }

}
