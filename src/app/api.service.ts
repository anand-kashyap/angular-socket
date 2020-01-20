import { ChatService } from './chat.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../environments/environment';

import { map, publishReplay, refCount } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.socketUrl;
  private newChatsArr;
  recentUsers: Observable<any>;
  private notify = new Subject<boolean>();
  private openNotify = new Subject<boolean>(); // get user object
  constructor(private httpClient: HttpClient, private router: Router, private chatService: ChatService) {}

  notifyMethod(val: boolean) {
    this.notify.next(val);
  }

  goToUrl(relativeUrl: string) {
    return this.router.navigateByUrl(relativeUrl);
  }

  isLoggedIn() {
    return this.chatService.isLoggedIn();
  }

  checkNotify() {
    return this.openNotify;
  }

  setNotify(user) {
    this.openNotify.next(user);
  }

  getNotify() {
    return this.notify;
  }

  login(loginInput: any): Observable<any> {
    const loginUrl = this.apiUrl + '/user/authenticate';
    return this.httpClient.post<any>(loginUrl, loginInput);
  }

  getToken() {
    return this.chatService.getFromLocal('token');
  }

  logout() {
    this.setNotify(false);
    this.chatService.clearUser();
    this.recentUsers = this.newChatsArr = null;
    this.router.navigate(['/']);
  }

  register(registerInput: any): Observable<any> {
    const registerUrl = this.apiUrl + '/user/register';
    return this.httpClient.post<any>(registerUrl, registerInput);
  }

  forgotPass(email: string): Observable<any> {
    const forgotUrl = this.apiUrl + '/user/forgot-password';
    return this.httpClient.post<any>(forgotUrl, {
      email,
      baseUrl: environment.baseUrl
    });
  }

  resetPass(resObj): Observable<any> {
    const resetUrl = this.apiUrl + '/user/reset-password';
    return this.httpClient.put<any>(resetUrl, resObj);
  }

  sendOtp(): Observable<any> {
    const verifyUrl = this.apiUrl + '/user/send-otp';
    // const headers = this.addXToken();
    const email = this.chatService.getUserInfo().email;
    return this.httpClient.post<any>(verifyUrl, { email });
  }

  confirmOtp(otpInput: any): Observable<any> {
    const confirmOtpUrl = this.apiUrl + '/user/confirm-otp';
    return this.httpClient.post<any>(confirmOtpUrl, otpInput);
  }

  checkIfUserExists(userString: string) {
    const checkUserUrl = this.apiUrl + '/user/check-username';
    const params = new HttpParams().set('userinput', userString).set('email', this.chatService.getUserInfo().email);
    return this.httpClient.get<any>(checkUserUrl, { params });
  }

  getUsersList(userString: string) {
    const searchUserUrl = this.apiUrl + '/user/search-user';
    const params = new HttpParams().set('userinput', userString);
    const body = this.chatService.getUserInfo();
    return this.httpClient.post<any>(searchUserUrl, { user: body }, { params });
  }

  updateRecentChats(newRoom, currentUserName: string) {
    // todo: modify for room instead of dm
    if (this.recentUsers) {
      for (const [i, room] of this.newChatsArr.entries()) {
        if (room._id === newRoom._id) {
          this.newChatsArr.splice(i, 1);
        }
      }
      const index = newRoom.members.indexOf(currentUserName);
      if (index !== -1) {
        newRoom.members.splice(index, 1);
      }
      this.newChatsArr.unshift(newRoom);
    }
  }

  getRecentChats(): Observable<any> {
    if (!this.newChatsArr) {
      const recentChatsUrl = `${this.apiUrl}/room/recentChats/${this.chatService.getUserInfo().username}`;
      this.recentUsers = this.httpClient.get<any>(recentChatsUrl).pipe(
        map(resp => {
          this.newChatsArr = resp.data;
          return resp.data;
        }),
        publishReplay(1),
        refCount()
      );
      return this.recentUsers;
    } else {
      return new Observable(observer => {
        observer.next([...this.newChatsArr]);
      });
    }
  }

  getUserDetails() {
    const getUserDetailsUrl = this.apiUrl + '/user/user-details';
    const params = new HttpParams().set('email', this.chatService.getUserInfo().email);
    return this.httpClient.get<any>(getUserDetailsUrl, { params });
  }

  getUserByUname(username) {
    const getByUnameUrl = this.apiUrl + '/user/getbyUsername';
    const params = new HttpParams().set('uname', username);
    return this.httpClient.get<any>(getByUnameUrl, { params });
  }

  updateProfile(userInfo) {
    const updateProfileUrl = this.apiUrl + '/user/update-profile';
    userInfo.email = this.chatService.getUserInfo().email;
    return this.httpClient.patch<any>(updateProfileUrl, userInfo);
  }

  findOrCreateRoom(currentUser: string, userNameArr: string[]) {
    const updateProfileUrl = this.apiUrl + '/room';
    return this.httpClient.put<any>(updateProfileUrl, { currentUser, userNameArr });
  }

  getRoomById(roomId: string, currentUser = null) {
    const getRoomUrl = this.apiUrl + '/room/' + roomId;
    let params = {};
    if (currentUser) {
      params = { currentUser };
    }
    return this.httpClient.get<any>(getRoomUrl, { params });
  }

  saveNotifySubs(notifySub) {
    const getRoomUrl = this.apiUrl + '/user/store-notification/' + this.chatService.getUserInfo().id;
    return this.httpClient.post<any>(getRoomUrl, { data: notifySub });
  }
}
