import { Injectable } from '@angular/core';
import { LogService } from "./log.service";


@Injectable({
  providedIn: 'root'
})
export class CartService {

  private logService: LogService;
  private cart = [];

  constructor(logService: LogService) {
    this.logService = logService;

  }

  addProductToCart (product) {
    let index = this.cart.findIndex(x => x.itemId === product.itemId);
    if(index!=-1) {
      this.cart[index].orderQuantity++;
    } else {
      product.orderQuantity = 1;
      this.cart.push(product);
    }

  }

  getProductsInCart () {
    return this.cart;
  }

  getTotalCartValue (){
    if(this.cart.length!=0) {
      let totalCartValue: number = this.cart.map(a => a.price * a.orderQuantity).reduce(function(a, b) {
        return a + b;
      });
      return totalCartValue;
    } else {
      return 0;
    }
  }

  clearCart(){
    this.cart = [];
  }

  getTotalProductsQuantityInCart () {
    if(this.cart.length!=0) {
      let totalTotalProdInCart: number = this.cart.map(a => a.orderQuantity).reduce(function(a, b) {
        return a + b;
      });
      return totalTotalProdInCart;
    } else {
      return 0;
    }
  }

  


}
