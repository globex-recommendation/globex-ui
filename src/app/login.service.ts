import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { LogService } from "./log.service";
import serverEnvConfig from "client.env.config";
import { Observable, map } from 'rxjs';

@Injectable()
export class LoginService {

  private logService: LogService;
  http: HttpClient;

  loginUrl = serverEnvConfig.ANGULR_API_LOGIN;

  userAuthenticated: boolean;
  username: string;

  constructor(logService: LogService, http: HttpClient) {
    this.logService = logService;
    this.http = http;
  }

  login(username: string, accessToken: string): Observable<boolean> {
    this.setUserAuthenticated(username,true);
    return this.http.post<HttpResponse<any>>(this.loginUrl, { username: username, accessToken: accessToken }, { observe: 'response' })
      .pipe(map(response => {
        if (response.status === 200) {
          return true;
        } else {
          return false;
        }
      }));
  }

  logout(): Observable<boolean> {
    this.setUserAuthenticated('', false);
    return this.http.delete<HttpResponse<any>>(this.loginUrl, { observe: 'response' })
      .pipe(map(response => {
        if (response.status === 204) {
          return true;
        } else {
          return false;
        }
      }));
  }

  isUserAuthenticated(): boolean {
    return this.userAuthenticated;
  }

  getAuthenticatedUser(): string {
    if (this.userAuthenticated) {
      return this.username
    } else {
      return '';
    }
  }

  setUserAuthenticated(username: string, authenticated: boolean) {
    this.userAuthenticated = authenticated;
    if (authenticated) {
      this.username = username;
    } else {
      this.username = '';
    }
  }
}