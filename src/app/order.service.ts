import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { HandleError, HttpErrorHandler } from './http-error-handler.service';
import { Order } from "./models/order.model";
import { catchError, map, Observable, of } from "rxjs";
import serverEnvConfig from "client.env.config";

@Injectable()
export class OrderService {

  http: HttpClient;
  private handleError: HandleError;

  orderServiceUrl = serverEnvConfig.ANGULAR_API_ORDER;

  constructor(http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.http = http;
    this.handleError = httpErrorHandler.createHandleError('OrderService');
  }

  submitOrder(order: Order): Observable<any> {
    return this.http.post<any>(this.orderServiceUrl, order)
      .pipe(map(response => ({status: 'ok', 'order': response.order})))
      .pipe(catchError(this.handleError('submitOrder', {status: 'error'})));
  }

}