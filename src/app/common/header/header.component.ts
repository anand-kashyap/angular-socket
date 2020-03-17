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
  constructor(public chatService: ChatService, private apiService: ApiService) {}

  ngOnInit() {
    this.prod = environment.production;
  }

  logout() {
    this.apiService.logout();
  }
}
