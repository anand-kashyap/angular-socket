import { ChatService } from './chat.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.socketUrl;

  constructor(private httpClient: HttpClient, private router: Router, private chatService: ChatService) { }

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
    return this.httpClient.post<any>(forgotUrl, {email, baseUrl: environment.baseUrl});
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
    return this.httpClient.post<any>(verifyUrl, {email}, { headers });
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
}
