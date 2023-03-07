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

  constructor(logService: LogService, http: HttpClient) {
    this.logService = logService;
    this.http = http;
  }

  login(username: String, password: String): Observable<boolean> {
    return this.http.post<HttpResponse<any>>(this.loginUrl, { username: username, password: password }, { observe: 'response' })
      .pipe(map(response => {
        if (response.status === 200) {
          return true;
        } else {
          return false;
        }
      }));
  }

  logout(): Observable<boolean> {
    return this.http.delete<HttpResponse<any>>(this.loginUrl, { observe: 'response' })
      .pipe(map(response => {
        if (response.status === 204) {
          return true;
        } else {
          return false;
        }
      }));
  }
}