import { Injectable } from '@angular/core';
import { LogService } from "./log.service";
import { CoolstoreCookiesService } from './coolstore-cookies.service';
import serverEnvConfig from "client.env.config";
import { HttpClient } from '@angular/common/http';
import { HandleError, HttpErrorHandler } from './http-error-handler.service';
import { CartItem } from './models/cart.model';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private logService: LogService;
  private cookiesService: CoolstoreCookiesService;
  private cart: CartItem[] = [];
  private handleError: HandleError;
  http: HttpClient;

  private synced: boolean = false;

  cartServiceUrl = serverEnvConfig.ANGULR_API_CART; 

  constructor(logService: LogService, cookieService: CoolstoreCookiesService, http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.logService = logService;
    this.cookiesService = cookieService;
    this.http = http;
    this.handleError = httpErrorHandler.createHandleError('CartService');
  }

  addProductToCart (product) {
    const cartItem : CartItem = {
      itemId: product.itemId,
      name: product.name,
      quantity: 1,
      price: product.price,
    };
    this.addItemToCart(cartItem)
  }

  addItemToCart(item: CartItem) {    
    let index = this.cart.findIndex(x => x.itemId === item.itemId);
    var cartItem : CartItem = null;
    if (index != -1) {
      this.cart[index].quantity++;
      cartItem = { ...this.cart[index]};
      cartItem.quantity = 1;
    } else {
      this.cart.push(item)
      cartItem = item;
    }
    if (this.cookiesService.getUserId() != '') {
      this.logService.log("addItemToCart: synching external cart")
      let user = this.cookiesService.getUserId();
      this.http.post<CartItem>(this.cartServiceUrl + "/" + user, cartItem).pipe(catchError(this.handleError('addItemToCart', cartItem)))
        .subscribe(response => {});
    }
  }

  removeItemFromCart(item: CartItem, quantity: number) {
    let index = this.cart.findIndex(x => x.itemId === item.itemId);
    var cartItem : CartItem = null;
    if (index != -1) {
      cartItem = { ...this.cart[index]};
      cartItem.quantity = 1;
      this.cart[index].quantity = this.cart[index].quantity - quantity;
      if (this.cart[index].quantity <= 0) {
        this.cart.splice(index, 1);
      }
    }
    if (this.cookiesService.getUserId() != '') {
      this.logService.log("removeItemFromCart: synching external cart")
      let user = this.cookiesService.getUserId();
      this.http.delete<CartItem>(this.cartServiceUrl + "/" + user, {body: cartItem}).pipe(catchError(this.handleError('addProductToCart', cartItem)))
        .subscribe(response => {});
    }
  }

  getCart(sync: boolean): Observable<CartItem[]> {
    this.logService.log('getCart called');
    // check if user is known. If so, get cart from cart service, if not use locally managed cart
    if (this.cookiesService.getUserId() != '' && sync && !this.synced) {
      this.logService.log("getCart: synching external cart")
      let user = this.cookiesService.getUserId();
      let obs: Observable<CartItem[]> = this.http.get<CartItem[]>(this.cartServiceUrl + "/" + user).pipe(catchError(this.handleError('getCart', this.cart)));
      obs.subscribe(c => {
        this.cart = c;
        this.synced = true;
      });
      return obs;
    }
    return of(this.cart);
  }

  mergeCart() {
    this.logService.log('mergeCart called');
    if (this.cookiesService.getUserId() != '' && !this.synced) {
      this.logService.log("mergeCart: merge with external cart")
      let user = this.cookiesService.getUserId();
      let obs: Observable<CartItem[]> = this.http.get<CartItem[]>(this.cartServiceUrl + "/" + user).pipe(catchError(this.handleError('getCart', this.cart)));
      obs.subscribe(c => {
        c.forEach(ci => {
          let index = this.cart.findIndex(x => x.itemId === ci.itemId);
          if (index == -1) {
            this.cart.push(ci);
          } else {
            let cartItem = { ...this.cart[index]};
            cartItem.quantity = this.cart[index].quantity;
            this.cart[index].quantity = this.cart[index].quantity + ci.quantity;
            this.http.post<CartItem>(this.cartServiceUrl + "/" + user, cartItem).pipe(catchError(this.handleError('addItemToCart', cartItem)))
              .subscribe(response => {});
          }
        });
        this.cart.forEach(ci => {
          let index = c.findIndex(x => x.itemId === ci.itemId);
          if (index == -1)  {
            this.http.post<CartItem>(this.cartServiceUrl + "/" + user, ci).pipe(catchError(this.handleError('addItemToCart', ci)))
              .subscribe(response => {});
          }
        });
        this.synced = true;
      });
    }
  }

  unsync() {
    this.synced = false;
  }

  getTotalCartValue (){
    if(this.cart.length!=0) {
      let totalCartValue: number = this.cart.map(a => a.price * a.quantity).reduce(function(a, b) {
        return a + b;
      });
      return totalCartValue;
    } else {
      return 0;
    }
  }

  clearCart(){
    this.cart = [];
    if (this.cookiesService.getUserId() != '') {
      this.logService.log("clearCart: synching external cart")
      let user = this.cookiesService.getUserId();
      this.http.delete(this.cartServiceUrl + "/empty/" + user).pipe(catchError(this.handleError('clearCart')))
      .subscribe(response => {});
    }
  }

  getTotalProductsQuantityInCart () {
    if(this.cart.length!=0) {
      let totalTotalProdInCart: number = this.cart.map(a => a.quantity).reduce(function(a, b) {
        return a + b;
      });
      return totalTotalProdInCart;
    } else {
      return 0;
    }
  }
}
