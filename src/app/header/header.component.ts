import { ApiService } from '../api.service';
import { ChatService } from './../chat.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private chatService: ChatService, private apiService: ApiService) { }

  ngOnInit() {
  }

  isLoggedIn() {
    return this.chatService.isLoggedIn();
  }

  logout() {
    this.apiService.logout();
  }

}
