import { ApiService } from '../../api.service';
import { ChatService } from '../../chat.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '@env/environment';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { slidelrAnimation } from '@app/animations/slideInOut';
import { SocketService } from '@app/user/socket.service';

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
  constructor(
    public chatService: ChatService,
    private sService: SocketService,
    private apiService: ApiService,
    private router: Router
  ) {}

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

  joinRoom({ username: toUserName }) {
    console.log('to', toUserName);
    const { username } = this.chatService.getUserInfo();

    // create or open existing room
    const eroomObj = this.sService.rooms$.getValue();
    const erooms = Object.values(eroomObj);
    const f: any = erooms.find((r: any) => r.directMessage && r.members[0] === toUserName);
    if (f) {
      this.search = false;
      this.router.navigateByUrl(`/user/chat/${f.id}`);
    } else {
      this.apiService.findOrCreateRoom(username, [toUserName]).subscribe(
        res => {
          console.log(res);
          this.search = false;
          this.router.navigateByUrl(`/user/chat/${res.data.id}`);
        },
        err => console.error(err)
      );
    }
  }

  logout() {
    this.apiService.logout();
  }
}
