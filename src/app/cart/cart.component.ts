import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { LoginService } from '../login.service';
import { CartItem } from '../models/cart.model'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart: CartItem[];

  cartService: CartService;
  loginService: LoginService

  constructor(cartService:CartService, loginService: LoginService) {
    this.cartService = cartService;
    this.loginService = loginService;
  }

  ngOnInit(): void {
    this.getCart(true);
  }

  getCart(synch: boolean) {
    this.cartService.getCart(synch).subscribe(cart => (this.cart = cart));
  }

  getTotalCartValue() {
    return this.cartService.getTotalCartValue();
  }

  clearCart(){
    this.cartService.clearCart();
    this.getCart(false);
  }

  getTotalProductsQuantityInCart(){
    this.cartService.getTotalProductsQuantityInCart();
  }

  addOneCount(cartItem: CartItem, index: number) {
    this.cartService.addItemToCart(cartItem);
    this.getCart(false);
  }

  removeOneCount(cartItem: CartItem, index: number){
    this.cartService.removeItemFromCart(cartItem, 1);
    this.getCart(false);
  }

  deleteCartItem(cartItem: CartItem, index: number){
    this.cartService.removeItemFromCart(cartItem, cartItem.quantity);
  }
}
