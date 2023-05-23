import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { catchError, mapTo, tap, map } from 'rxjs/operators';
import { config } from '../variables';
import { Tokens } from '../interfaces';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private loggedUser: string;
  private apiUrl: string;

  private isAuthenticated = false;
  private userId;
  private ourcode;
  private accesstoken;
  private clientId = '5099803df3f4948bd2f98391';
  private clientSecret = '5099803df3f4948bd2f98392';
  private windowHandle;
  private httpOptions = {
    withCredentials: true,
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };




  constructor(private http: HttpClient, private router: Router,
    // @Inject('LOCALSTORAGE') private localStorage: any,
    @Inject(PLATFORM_ID) private platformId: Object) {

    // this.httpOptions.headers.append('Access-Control-Allow-Origin', '*');
    this.apiUrl = `${config.apiUrl}/auth`;
  }

  login(user: { username: string, password: string }): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/login`, user/* , this.httpOptions */)
      .pipe(
        tap(tokens => this.doLoginUser(user.username, tokens)),
        mapTo(true),
        catchError(error => {
          // this.doLogoutUser(),
          alert(JSON.stringify(error.error));
          return of(false);
        }));
  }

  logout() {

    const rT = this.getRefreshToken();

    return this.http.post<any>(`${this.apiUrl}/logout`, {
      refreshToken: rT
    }).pipe(
      tap(() => this.doLogoutUser()),
      mapTo(true),
      catchError(error => {
        alert(JSON.stringify(error.error));
        return of(false);
      }));
  }

  isLoggedIn() {
    // console.log(this.getJwtToken(), !!this.getJwtToken());
    return !!this.getJwtToken();
    // if (this.getJwtToken() === undefined) { return false; } else { return !!this.getJwtToken(); }
  }

  signup(user: { username: string, password: string }): Observable<boolean> {
    return this.http.post<any>(`${this.apiUrl}/signup`, user)
      .pipe(
        tap(res => {
          console.log(res);
          return res;
        }),
        map(data => data.user),
        catchError(error => {
          // this.doLogoutUser(),
          alert(JSON.stringify(error.error));
          return of(false);
        }));
  }

  refreshToken() {
    return this.http.post<any>(`${this.apiUrl}/refresh`, {
      refreshToken: this.getRefreshToken()
    }).pipe(tap((tokens: Tokens) => {
      this.storeJwtToken(tokens.jwt);
    }));
  }

  getJwtToken() {
    // Client only code.
    if (isPlatformBrowser(this.platformId)) {

      return localStorage.getItem(this.JWT_TOKEN);
    } else return null
    // return this.localStorage.getItem(this.JWT_TOKEN);
  }

  getUserId(): string {
    // Client only code.
    if (isPlatformBrowser(this.platformId)) {

      return localStorage.getItem('userId');
    } else return null
  }

  authorizeuser(redirectUri: string) {

    this.windowHandle = window.open(
      `${this.apiUrl}/v2/authorize?client_id=${this.clientId}&response_type=code&redirect_uri=${redirectUri}`
      , '_parent');
    let href;

    setTimeout(() => {
      href = this.windowHandle.location.href;

      // this.windowHandle.close();
      const extractedcode = href.split('=');
      this.ourcode = extractedcode[1];
      if (this.ourcode) { this.getAccessToken(); } else { console.log('Access denied. Try again'); }
    }, 15000);
  }

  getAccessToken() {
    const bearierheader = btoa(this.clientId + ':' + this.clientSecret);

    const headers = new HttpHeaders();

    headers.append('Authorization', 'Bearer ' + bearierheader);
    headers.append('Content-Type', 'application/X-www-form-urlencoded');

    const tokendata = 'code=' + this.ourcode +
      '&grant_type=authorization_code&redirect_uri=http://localhost:4200/service/login';

    this.http.post(
      `${this.apiUrl}/v2/token`,
      tokendata,
      { headers })
      .subscribe((data: { token: string }) => {
        this.accesstoken = data.token;
        console.log(this.accesstoken);
        this.router.navigate(['/dashboard']);
      });
  }

  getClient() {

    const appid = this.randomstring(10);
    const appsecret = this.randomstring(10);
    const newclient = this.randomstring(10);
    const client = 'name=' + newclient + '&id=' + appid + '&secret=' + appsecret;

    const headers = new HttpHeaders();

    headers.append('Content-Type', 'application/X-www-form-urlencoded');

    return this.http.post<any>(`${this.apiUrl}/client`, client/* , this.httpOptions */)
      .pipe(
        tap(tokens => { } /* this.doLoginUser(user.username, tokens) */),
        mapTo(true),
        catchError(error => {

          alert(JSON.stringify(error.error));
          return of(false);
        }));
  }

  private doLoginUser(username: string, tokens: Tokens) {
    this.loggedUser = username;
    this.storeTokens(tokens);
  }

  private doLogoutUser() {
    this.loggedUser = null;
    this.removeTokens();
  }

  private getRefreshToken() {
    // Client only code.
    if (isPlatformBrowser(this.platformId)) {

      return localStorage.getItem(this.REFRESH_TOKEN);
    }
    return undefined
    // return this.localStorage.getItem(this.REFRESH_TOKEN);
  }

  private storeJwtToken(jwt: string) {
    // Client only code.
    if (isPlatformBrowser(this.platformId)) {

      localStorage.setItem(this.JWT_TOKEN, jwt);
    }
    // this.localStorage.setItem(this.JWT_TOKEN, jwt);

  }

  private storeTokens(tokens: Tokens) {

    // Client only code.
    if (isPlatformBrowser(this.platformId)) {

      localStorage.setItem(this.JWT_TOKEN, tokens.jwt);
      localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
      localStorage.setItem('userId', tokens.userId)
    }
    // this.localStorage.setItem(this.JWT_TOKEN, tokens.jwt);
    // this.localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);

  }

  private removeTokens() {

    // Client only code.
    if (isPlatformBrowser(this.platformId)) {

      localStorage.removeItem(this.JWT_TOKEN);
      localStorage.removeItem(this.REFRESH_TOKEN);
      localStorage.removeItem('userId');
    }

    // this.localStorage.removeItem(this.JWT_TOKEN);
    // this.localStorage.removeItem(this.REFRESH_TOKEN);
  }

  private randomstring(len) {
    const buf = [];
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charlen = chars.length;

    for (let i = 0; i < len; ++i) {
      buf.push(chars[this.getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
  }

  private getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
