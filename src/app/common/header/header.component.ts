import { ApiService } from '../../api.service';
import { ChatService } from '../../chat.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { slidelrAnimation } from '@app/animations/slideInOut';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [slidelrAnimation]
})
export class HeaderComponent implements OnInit {
  prod: boolean;
  loader = false;
  search = false;
  userListNew: Array<any> = [];
  constructor(public chatService: ChatService, private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.prod = environment.production;
  }

  searchUserNew(text) {
    console.log('innew outsear', text);
    this.loader = true;
    this.apiService
      .getUsersList(text)
      .pipe(map(r => r.data))
      .subscribe(res => {
        // this.userListNew = [...res];
        this.userListNew = res;
        this.loader = false;
        console.log(res);
      });
  }

  joinRoom(userObj) {
    console.log('to', userObj.username);
    const { username } = this.chatService.getUserInfo();

    // create or open existing room
    this.apiService.findOrCreateRoom(username, [userObj.username]).subscribe(
      res => {
        console.log(res);
        this.search = false;
        this.router.navigateByUrl(`/user/chat/${res.data.id}`);
      },
      err => console.error(err)
    );
  }

  logout() {
    this.apiService.logout();
  }
}
