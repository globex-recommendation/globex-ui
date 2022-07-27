import { Injectable } from "@angular/core";
import { LogService } from "./log.service";
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HandleError, HttpErrorHandler } from './http-error-handler.service';
import serverEnvConfig from "client.env.config";
import { CheckoutPayload } from "./models/checkout_payload.model";


@Injectable()
export class CoolStoreProductsService {
  
  
  paginatedProductsListUrl = serverEnvConfig.ANGULR_API_GETPAGINATEDPRODUCTS;  // URL to web api
  paginationLimit = serverEnvConfig.ANGULR_API_GETPAGINATEDPRODUCTS_LIMIT; //number of products per page
  recommendedProductsListUrl = serverEnvConfig.ANGULR_API_GETRECOMMENDEDPRODUCTS;  // URL to web api
  getProductDetailsByIdsUrl = serverEnvConfig.ANGULR_API_GETPRODUCTDETAILS_FOR_IDS;  // URL to web api
  submitOrderUrl = serverEnvConfig.ANGULR_API_SUBMITORDER;  // URL to web api

  private handleError: HandleError;
  private logService: LogService;
  http: HttpClient;
  
  static getRecommendedProducts: any;
  
  
  constructor(logService: LogService,  http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.logService = logService;
    this.http = http;
    this.handleError = httpErrorHandler.createHandleError('CoolStoreProductsService');
  }

  

 
  fetchPaginatedProductsList(page): Observable<any> {
    return this.http.get<any>(this.paginatedProductsListUrl+"?page="+page + "&limit="+this.paginationLimit ) 
      .pipe(
        catchError(this.handleError('fetchPaginatedProductsList', ''))
      );
  }

  fetchFavouriteProductsList(page): Observable<any> {
    return this.http.get<any>(this.paginatedProductsListUrl+"?page="+page + "&limit="+this.paginationLimit ) 
      .pipe(
        catchError(this.handleError('fetchPaginatedProductsList', ''))
      );
  }

  /** getRecommendedProducts  from the server */
  getRecommendedProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.recommendedProductsListUrl)
      .pipe(
        catchError(this.handleError('[[CoolStoreProductsService]-[getRecommendedProducts]', []))
      );
  }

  /** getProductDetailsByIds  from the server */
  getProductDetailsByIds(productIds): Observable<any[]> {
    console.log("[CoolStoreProductsService]-[getProductDetailsByIds] called");
    return this.http.get<any[]>(this.getProductDetailsByIdsUrl+"?productIds=" + productIds)
      .pipe(
        catchError(this.handleError('[[CoolStoreProductsService]-[getProductDetailsByIdsUrl]', []))
      );
  }

  /** submitOrder  from the server */
  placeOrder(orderData): Observable<any> {
    console.log("[placeOrder] this.checkout_payload", orderData);
    return this.http.post<CheckoutPayload>(this.submitOrderUrl, orderData)
    .pipe(
      catchError(this.handleError('userActivityObj', orderData))
    );


  }
  

}
