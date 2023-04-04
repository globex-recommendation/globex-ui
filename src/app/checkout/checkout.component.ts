import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { CookieService } from 'ngx-cookie-service';
import { Address, CheckoutData, init as initCheckoutData } from '../models/checkout.model';
import { CustomerService } from '../customer.service';
import { LineItem, Order, ShippingAddress } from '../models/order.model';
import { CartItem } from '../models/cart.model';
import { OrderService } from '../order.service';
import { LogService } from '../log.service';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  cartService:CartService;
  loginService: LoginService;
  customerService: CustomerService;
  orderService: OrderService;
  logService: LogService;
  itemsInCart: CartItem[];
  checkoutData: CheckoutData
  order: any;

  orderSubmissionError = false;

  constructor(logService: LogService, cookieService: CookieService, loginService: LoginService, 
    cartService:CartService, customerService: CustomerService, orderService: OrderService) {
    this.loginService = loginService;
    this.cartService = cartService;
    this.customerService = customerService;
    this.orderService = orderService;
    this.logService = logService;
    this.getItemsInCart();
    this.init();

  }
  submitted = false;

  onSubmit() { this.submitted = true; }


  ngOnInit(): void {
  }

  getItemsInCart() {
    this.cartService.getCart(false).subscribe(cartItems => {
      this.itemsInCart = cartItems;
    });
  }

  getTotalCartValue() {
    return this.cartService.getTotalCartValue();
  }

  getTotalProductsQuantityInCart(){
    return this.cartService.getTotalProductsQuantityInCart();
  }

  getTotalValueForItem(index: number) {
    const cartItem: CartItem = this.itemsInCart[index];
    return cartItem.price * cartItem.quantity;
  }

  getCustomerInfo() {
    if(!this.loginService.isUserAuthenticated()) {
      return;
    }
    this.customerService.getCustomerInfo(this.loginService.getAuthenticatedUser())
      .subscribe(c => {
        if (!c) {
          this.logService.error('customer service returned null')
        }

        let checkoutAddress: Address = {
          first_name: c.firstName,
          last_name: c.lastName,
          phone: c.phone,
          address1: c.address.address1,
          address2: c.address.address2,
          city: c.address.city,
          zip: c.address.zipCode,
          state: c.address.state,
          country: c.address.country
        };
        this.checkoutData = {
          customerEmail: c.email,
          shippingAddress: checkoutAddress,
          billingAddress: checkoutAddress,
          payment: {
            ccNameOnCard: c.firstName + ' ' + c.lastName,
            ccNumber: '1122-3344-5566-7788',
            ccExpiry: { year:new Date().getFullYear(), month:12, day:12 },
            ccCvv: '123'
          }
        };

      });
  }

  submitOrder() {

    this.orderSubmissionError = false;

    if(!this.loginService.isUserAuthenticated) {
      return;
    }

    const shippingAddress: ShippingAddress = {
      name: this.checkoutData.shippingAddress.first_name + ' ' + this.checkoutData.shippingAddress.last_name,
      phone: this.checkoutData.shippingAddress.phone,
      address1: this.checkoutData.shippingAddress.address1,
      address2: this.checkoutData.shippingAddress.address2,
      city: this.checkoutData.shippingAddress.city,
      zip: this.checkoutData.shippingAddress.zip,
      state: this.checkoutData.shippingAddress.state,
      country: this.checkoutData.shippingAddress.country
    }

    const lineItems: LineItem[] = [];
    this.itemsInCart.forEach(cartItem => {
      lineItems.push({product: cartItem.itemId, quantity: cartItem.quantity, price: cartItem.price});
    })

    const order: Order = {customer: this.loginService.getAuthenticatedUser(), shippingAddress: shippingAddress, lineItems: lineItems};
    this.orderService.submitOrder(order).subscribe(response => {
      if (response.status == 'ok') {
        this.order = {newOrderPlaced: true, orderId: response.order};
        this.clearCart();
      } else {
        this.orderSubmissionError = true;
      }
    })
  }

  clearCart(){
    this.itemsInCart = [];
    this.checkoutData = null;
    this.cartService.clearCart();
  }

  init() {
    this.checkoutData = initCheckoutData();
  }
}

