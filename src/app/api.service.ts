import { ChatService } from './chat.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../environments/environment';

import { map, publishReplay, refCount } from 'rxjs/operators';
import { SocketService } from './user/socket.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.socketUrl;
  recentUsers: Observable<any>;
  private notify = new Subject<boolean>();
  private openNotify = new Subject<boolean>(); // get user object
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private chatService: ChatService,
    private socketService: SocketService
  ) {}

  notifyMethod(val: boolean) {
    this.notify.next(val);
  }

  goToUrl(relativeUrl: string) {
    return this.router.navigateByUrl(relativeUrl);
  }

  isLoggedIn() {
    return this.chatService.isLoggedIn;
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
    this.socketService.loggedIn$.next(false);
    this.recentUsers = null;
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

  getRecentChats(): Observable<any> {
    const rurl = `${this.apiUrl}/room/recentChats/${this.chatService.getUserInfo().username}`;
    return this.httpClient.get<any>(rurl).pipe(map(r => r.data));
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

  uploadFile(file): Observable<any> {
    const uploadUrl = this.apiUrl + '/files/upload?ngsw-bypass=true';
    return this.httpClient.post<any>(uploadUrl, file, { reportProgress: true, observe: 'events' });
  }

  getFile(name: string): Observable<any> {
    const getUrl = this.apiUrl + '/files/' + name;
    return this.httpClient.get<any>(getUrl);
  }
}
