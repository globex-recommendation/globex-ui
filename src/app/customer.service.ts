import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { LogService } from "./log.service";
import { Customer, Address } from './models/customer.model';
import serverEnvConfig from "client.env.config";
import { HandleError, HttpErrorHandler } from './http-error-handler.service';

@Injectable()
export class CustomerService {
  
  logService: LogService;
  http: HttpClient;
  private handleError: HandleError;

  customerServiceUrl = serverEnvConfig.ANGULR_API_CUSTOMER;

  constructor(logService: LogService, http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.logService = logService;
    this.http = http;
    this.handleError = httpErrorHandler.createHandleError('CustomerService');
  }

  getCustomerInfo(customerId: string): Observable<Customer> {
    return this.http.get<Customer>(this.customerServiceUrl + '/' + customerId)
      .pipe(catchError(this.handleError('getCustomerInfo', null)));
  }

}