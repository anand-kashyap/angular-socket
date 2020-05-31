import { ChatService } from './chat.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '@env/environment';

import { map } from 'rxjs/operators';
import { SocketService } from './user/socket.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  recentUsers;
  private notify = new Subject<boolean>();
  private openNotify = new Subject<boolean>(); // get user object
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private chatService: ChatService,
    private socketService: SocketService
  ) {}

  login = loginInput => this.httpClient.post<any>('/user/authenticate', loginInput);

  logout() {
    this.setNotify(false);
    this.chatService.clearUser();
    this.socketService.loggedIn$.next(false);
    this.socketService.rooms$.next({});
    this.socketService.roomCalled = false;
    this.recentUsers = null;
    this.router.navigateByUrl('/');
  }

  register = registerInput => this.httpClient.post<any>('/user/register', registerInput);

  forgotPass = (email: string) =>
    this.httpClient.post<any>('/user/forgot-password', {
      email,
      baseUrl: environment.baseUrl
    });

  resetPass = resObj => this.httpClient.put<any>('/user/reset-password', resObj);

  getLUser = () => this.chatService.getUserInfo();

  sendOtp() {
    const { email } = this.getLUser();
    return this.httpClient.post<any>('/user/send-otp', { email });
  }

  confirmOtp = otpInput => this.httpClient.post<any>('/user/confirm-otp', otpInput);

  checkIfUserExists(userString: string) {
    const params = new HttpParams().set('userinput', userString).set('email', this.getLUser().email);
    return this.httpClient.get<any>('/user/check-username', { params });
  }

  getUsersList(userString: string) {
    const params = new HttpParams().set('userinput', userString),
      user = this.getLUser();
    return this.httpClient.post<any>('/user/search-user', { user }, { params });
  }

  getRecentChats() {
    const rurl = `/room/recentChats/${this.getLUser().username}`;
    return this.httpClient.get<any>(rurl).pipe(map(r => r.data));
  }

  getUserDetails() {
    const params = new HttpParams().set('email', this.getLUser().email);
    return this.httpClient.get<any>('/user/user-details', { params });
  }

  getUserByUname(username: string) {
    const params = new HttpParams().set('uname', username);
    return this.httpClient.get<any>('/user/getbyUsername', { params });
  }

  updateProfile(userInfo) {
    userInfo.email = this.getLUser().email;
    return this.httpClient.patch<any>('/user/update-profile', userInfo);
  }

  findOrCreateRoom = (currentUser: string, userNameArr: string[]) =>
    this.httpClient.put<any>('/room', { currentUser, userNameArr });

  getRoomById(roomId: string, currentUser = null) {
    let params = {};
    if (currentUser) {
      params = { currentUser };
    }
    return this.httpClient.get<any>('/room/' + roomId, { params });
  }

  saveNotifySubs(notifySub) {
    const getRoomUrl = '/user/store-notification/' + this.getLUser().id;
    return this.httpClient.post<any>(getRoomUrl, { data: notifySub });
  }

  uploadFile(file) {
    const uploadUrl = '/files/upload?ngsw-bypass=true';
    return this.httpClient.post<any>(uploadUrl, file, { reportProgress: true, observe: 'events' });
  }

  getFile = (name: string) => this.httpClient.get<any>(`/files/${name}`);

  getToken = () => this.chatService.getFromLocal('token');

  notifyMethod = (val: boolean) => this.notify.next(val);

  isLoggedIn = () => this.chatService.isLoggedIn;

  checkNotify = () => this.openNotify;

  setNotify = user => this.openNotify.next(user);

  getNotify = () => this.notify;
}
