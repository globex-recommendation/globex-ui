import { Component, Input, OnInit } from '@angular/core';
import { CoolStoreProductsService } from '../coolstore-products.service';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from '../cart.service';
import { CoolstoreCookiesService } from '../coolstore-cookies.service';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input() product:any;
  coolStoreService:CoolStoreProductsService;
  cookieService: CookieService;
  cartService:CartService;
  coolstoreCookiesService: CoolstoreCookiesService;

  likeProductsListFromCookie = new Array;

  constructor(coolStoreService:CoolStoreProductsService, cookieService: CookieService,
    coolstoreCookiesService: CoolstoreCookiesService, cartService:CartService) {
    this.coolStoreService = coolStoreService;
    this.cookieService = cookieService;
    this.coolstoreCookiesService = coolstoreCookiesService;
    this.cartService = cartService;
  }

  ngOnInit(): void {
   this.setupProductLikes()

  }

  setupProductLikes(){
    var productLikesCookieValue = this.cookieService.get('productLikes');
    this.likeProductsListFromCookie = productLikesCookieValue.split(',');
    if(this.likeProductsListFromCookie.indexOf(this.product.itemId) !== -1){
      this.product.liked = true;
    }
  }


  saveUserLike(event, product) {
      this.coolstoreCookiesService.saveUserLike(event, product);

  }
  removeProductLike(event, product) {
    this.coolstoreCookiesService.removeProductLike(event, product);

  }

  addToCart(event, product) {
    this.cartService.addProductToCart(product);
  }
}
