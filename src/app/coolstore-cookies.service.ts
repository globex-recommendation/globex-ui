import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ActionInfo, Activity, UserActivityModel, UserInfo } from './models/user-activity.model';
import {v4 as uuidv4} from 'uuid';
import { GlobexConstants } from './core/constants/globex.constants';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HandleError, HttpErrorHandler } from './http-error-handler.service';
import { catchError, Observable } from 'rxjs';
import serverEnvConfig from 'client.env.config';

@Injectable({
  providedIn: 'root'
})

export class CoolstoreCookiesService {
  cookieService: CookieService;
  likeProductsListFromCookie = new Array;
  userDetailsMap = new Map;
  userDetailsFromCookie;
  private handleError: HandleError;
  http: HttpClient;
  userActivityObj;
  public user;


  constructor(cookieService: CookieService, private route: ActivatedRoute, http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.cookieService = cookieService;
    this.http = http;
    this.handleError = httpErrorHandler.createHandleError('CoolstoreCookiesService');
    this.initialize();
  }

  initialize() {
    this.cookieService.delete('globex_session_token');
    if (this.cookieService.check('globex_user_id')) {
      const username = this.cookieService.get('globex_user_id');
      this.user = {isUserLoggedIn:false, name: username, email:"", password:""}
    } else {
      this.user = {isUserLoggedIn:false, name: "", email:"", password:""}
    }
    this.getUserDetailsFromCookie();
  }

  getUserDetailsFromCookie() {

    this.userDetailsFromCookie = this.cookieService.get('userDetailsMap');


    if(!this.cookieService.check('userDetailsMap')) {
      console.log("no user details yet");
      this.userDetailsMap["firstVisitTs"] = new Date().getTime().toString();
      this.userDetailsMap["prevVisitTs"]= new Date().getTime().toString();
      this.userDetailsMap["currentVisitTs"]= new Date().getTime().toString();
      this.userDetailsMap["userId"] = uuidv4();
      this.userDetailsMap["newVisit"] = 1;
      this.userDetailsMap["visitsCount"] = 1;
      this.cookieService.set('userDetailsMap', JSON.stringify(this.userDetailsMap));
    } else {
      this.userDetailsMap = JSON.parse(this.userDetailsFromCookie);
      this.userDetailsMap["prevVisitTs"] = this.userDetailsMap["currentVisitTs"];
      this.userDetailsMap["currentVisitTs"] = new Date().getTime().toString();
      this.userDetailsMap["newVisit"] = 0;

      var visitsCount = this.userDetailsMap["visitsCount"];
      this.userDetailsMap["visitsCount"] = visitsCount ? visitsCount+1 : 1;

      this.cookieService.set('userDetailsMap', JSON.stringify(this.userDetailsMap));
    }
  }

  retrieveUserDetailsFromCookie() {
    return  this.userDetailsMap;
  }

  saveUserLike(event, product) {
    product.liked = true;
    var productLikesCookieValue = this.cookieService.get('productLikes')
    var likedProductsList = [];
    if(productLikesCookieValue!=='') {
      likedProductsList = productLikesCookieValue.split(',');
    }
    likedProductsList.push(product.itemId)
    likedProductsList= likedProductsList.filter((item, i, ar) => ar.indexOf(item) === i);
    this.cookieService.set('productLikes', likedProductsList.toString());


    this.userActivityObj = new UserActivityModel(
                              GlobexConstants.General.SITE_ID,
                              new Activity(
                                this.userDetailsMap["userId"],
                                this.route.snapshot.url.toString(),
                                uuidv4(),
                                GlobexConstants.General.USER_ACTIVITY_LIKE
                                ) ,
                              new UserInfo(
                                this.userDetailsMap["visitsCount"], //visitsCount
                                new Date().getTime(), //prevVisitTs
                                new Date().getTime(), //firstVisitTs
                                GlobexConstants.General.CAMPAIGN,
                                this.userDetailsMap["newVisit"],  //0 for NO, 1 for YES
                                this.dateToFormattedString() //localTime
                              ),
                              new ActionInfo(product.itemId, '', '')
                              )

        this.saveUserActivityPost().subscribe(response =>         {
          console.log("saveUserActivityPost", response);
        });

  }


  saveUserActivityPostUrl = serverEnvConfig.ANGULR_API_TRACKUSERACTIVITY;  // URL to web api
  saveUserActivityPost(): Observable<UserActivityModel> {
    return this.http.post<UserActivityModel>(this.saveUserActivityPostUrl, this.userActivityObj)
      .pipe(catchError(this.handleError('userActivityObj', this.userActivityObj)));
  }


  dateToFormattedString() {
    return new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString();
  };



  getAllProductLikes(){
     var productLikesCookieValue = this.cookieService.get('productLikes');
     this.likeProductsListFromCookie = productLikesCookieValue.split(',');
     console.log("this.likeProductsListFromCookie", this.likeProductsListFromCookie)
   }

   setupSingleProductForLike(currentProduct){
    if(this.likeProductsListFromCookie.indexOf(currentProduct.id) !== -1){
      currentProduct.liked = true;
    }
    console.log("[CoolstoreCookieService].setupProductLikes()", currentProduct)
  }


  removeProductLike(event, currentProduct){
    currentProduct.liked = false;
      this.likeProductsListFromCookie.forEach((element,index)=>{
      if(element===currentProduct.itemId) {
        this.likeProductsListFromCookie.splice(index,1);
        currentProduct.liked = false;
      }
   });
   this.cookieService.set('productLikes', this.likeProductsListFromCookie.toString());
  }

  isProductLiked(currentProductId){
    this.getAllProductLikes();
    if(this.likeProductsListFromCookie.indexOf(currentProductId) !== -1){
      return true;
    } else {
      return false;
    }
  }

  setUserFromCookies() {
    if (this.cookieService.check('globex_user_id') && this.cookieService.check('globex_session_token')) {
      const username = this.cookieService.get('globex_user_id');
      this.user = {isUserLoggedIn:true, name: username, email:"", password:""}
    }
  }

  isUserLoggedIn() {
    return this.user.isUserLoggedIn;
  }

  getUserId() {
    return this.user.name;
  }

  resetUser() {
    this.cookieService.delete('globex_session_token');
    this.cookieService.delete('globex_user_id');
    this.user = {isUserLoggedIn:false, name: "", email:"", password:""}
  }

  getSession() {
    if (this.cookieService.check('globex_session_token')) {
      return this.cookieService.get('globex_session_token');
    }
    return null;
  }
}


/**
 * generate groups of 4 random characters
 * @example getUniqueId(1) : 607f
 * @example getUniqueId(2) : 95ca-361a-f8a1-1e73
 */
 export function getUniqueId(parts: number): string {
  const stringArr = [];
  for(let i = 0; i< parts; i++){
    // tslint:disable-next-line:no-bitwise
    const S4 = (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    stringArr.push(S4);
  }
  return stringArr.join('-');
}