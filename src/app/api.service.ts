import { ChatService } from './chat.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
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
  constructor(private httpClient: HttpClient, private router: Router, private chatService: ChatService) {}

  login(loginInput: any): Observable<any> {
    const loginUrl = this.apiUrl + '/user/authenticate';
    return this.httpClient.post<any>(loginUrl, loginInput);
  }

  logout() {
    this.chatService.clearUser();
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

  addXToken() {
    return new HttpHeaders({
      'x-access-token': this.chatService.getFromLocal('token')
    });
  }

  sendOtp(): Observable<any> {
    const verifyUrl = this.apiUrl + '/user/send-otp';
    const headers = this.addXToken();
    const email = this.chatService.getUserInfo().email;
    return this.httpClient.post<any>(verifyUrl, { email }, { headers });
  }

  confirmOtp(otpInput: any): Observable<any> {
    const confirmOtpUrl = this.apiUrl + '/user/confirm-otp';
    const headers = this.addXToken();
    return this.httpClient.post<any>(confirmOtpUrl, otpInput, { headers });
  }

  checkIfUserExists(userString: string) {
    const checkUserUrl = this.apiUrl + '/user/check-username';
    const params = new HttpParams().set('userinput', userString).set('email', this.chatService.getUserInfo().email);
    const headers = this.addXToken();
    return this.httpClient.get<any>(checkUserUrl, { headers, params });
  }

  getUsersList(userString: string) {
    const searchUserUrl = this.apiUrl + '/user/search-user';
    const params = new HttpParams().set('userinput', userString);
    const body = this.chatService.getUserInfo();
    const headers = this.addXToken();
    return this.httpClient.post<any>(searchUserUrl, { user: body }, { headers, params });
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
      const headers = this.addXToken();
      this.recentUsers = this.httpClient
        .get<any>(recentChatsUrl, { headers })
        .pipe(
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
    const headers = this.addXToken();
    return this.httpClient.get<any>(getUserDetailsUrl, { headers, params });
  }

  updateProfile(userInfo) {
    const updateProfileUrl = this.apiUrl + '/user/update-profile';
    userInfo.email = this.chatService.getUserInfo().email;
    const headers = this.addXToken();
    return this.httpClient.patch<any>(updateProfileUrl, userInfo, { headers });
  }

  findOrCreateRoom(userNameArr: string[]) {
    const updateProfileUrl = this.apiUrl + '/room';
    const headers = this.addXToken();
    return this.httpClient.put<any>(updateProfileUrl, { userNameArr }, { headers });
  }

  getRoomById(roomId: string, currentUser = null) {
    const getRoomUrl = this.apiUrl + '/room/' + roomId;
    let params = {};
    if (currentUser) {
      params = { currentUser };
    }
    const headers = this.addXToken();
    return this.httpClient.get<any>(getRoomUrl, { headers, params });
  }
}
