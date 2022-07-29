import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { CoolStoreProductsService } from '../coolstore-products.service';
import { CoolstoreCookiesService } from '../coolstore-cookies.service';
import { CookieService } from 'ngx-cookie-service';
import { Address, CheckoutPayload, LineItem } from '../models/checkout_payload.model';
import { add } from 'lodash';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  coolStoreService:CoolStoreProductsService;
  cookieService: CookieService;
  cartService:CartService;
  coolstoreCookiesService: CoolstoreCookiesService;
  productsInCart;
  billingAndShippingSame=false;
  checkout_payload = new CheckoutPayload();    
  order;
  orderSubmissionError = false;

  constructor(coolStoreService:CoolStoreProductsService, cookieService: CookieService, 
    coolstoreCookiesService: CoolstoreCookiesService, cartService:CartService) {
    this.coolStoreService = coolStoreService;
    this.cookieService = cookieService;
    this.coolstoreCookiesService = coolstoreCookiesService;
    this.cartService = cartService;   
    this.getProductsInCart();
    
  }
  submitted = false;

  onSubmit() { this.submitted = true; }


  ngOnInit(): void {
    
  }

  getProductsInCart() {
    this.productsInCart = this.cartService.getProductsInCart();
    this.setupLineItems();

  }

  getTotalCartValue() {
    return this.cartService.getTotalCartValue();
  }

  getTotalProductsQuantityInCart(){
    return this.cartService.getTotalProductsQuantityInCart();
  }

  setupLineItems() {
    console.log("this.productsInCart", this.productsInCart)
    this.checkout_payload.user_info.email = this.coolstoreCookiesService.user.email;
    this.productsInCart.forEach(product => {
      this.checkout_payload.line_items.push(
        new LineItem(product.itemId, product.price, product.orderQuantity, product.itemId)
      )  
    });
    console.log("this.checkout_payload.line_items", this.checkout_payload.line_items);
  }

  autofill() {
    var address = new Address();
    address.address1 = "3764 Elvis Presley Boulevard";
    address.first_name = "Elvis ";
    address.last_name="Presley";
    address.city="Memphis";
    address.country="country";
    address.state="Tennessee";
    address.zip="38153";
    address.phone="1-45678-2343";
    this.checkout_payload.billing_address = address;
    this.checkout_payload.shipping_address = address;
    this.checkout_payload.payment.card_cvv="123";
    this.checkout_payload.payment.card_expiry_date = {year:2022, month:12, day:12};
    //this.get('endDate').setValue(...)

    this.checkout_payload.payment.name_on_card="Elvis Presley";
    this.checkout_payload.payment.credit_card_number="1122-3344-5566-7788"
   }

  placeOrder() {

    this.orderSubmissionError = false;
    //TO-DO
    this.checkout_payload.user_info.username = this.coolstoreCookiesService.user.email;
    this.checkout_payload.user_info.customer_id = this.checkout_payload.user_info.username;
    this.checkout_payload.user_info.userId = this.coolstoreCookiesService.retrieveUserDetailsFromCookie()["userId"];
    this.checkout_payload.currency.currency = "USD";

    
    this.coolStoreService.placeOrder(this.checkout_payload).subscribe(response =>         {
      console.log("submitOrderPost", response);
      if(response.status=='CONFIRMED') {
        this.order = {newOrderPlaced: true, orderId: response.order_id};
        this.clearCart();
      } else {
        this.orderSubmissionError = true;
      }
    });
  }
  
  clearCart(){
    this.productsInCart = [];
    this.checkout_payload = new CheckoutPayload();    
    this.cartService.clearCart();
  }
  


}

