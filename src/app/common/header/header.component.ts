import { ApiService } from '../../api.service';
import { ChatService } from '../../chat.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  prod: boolean;
  constructor(private chatService: ChatService, private apiService: ApiService) {}

  ngOnInit() {
    this.prod = environment.production;
  }

  isLoggedIn() {
    return this.chatService.isLoggedIn();
  }

  logout() {
    this.apiService.logout();
  }
}
