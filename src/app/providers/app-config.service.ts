import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config: any;
  constructor(private http: HttpClient) { }
  public loadConfig() {
//App initialization code here
  }
  getConfig() {
    return this.config;
  }
}