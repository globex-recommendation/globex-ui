import { Component, OnInit, Inject, PLATFORM_ID  } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from '../cart.service';
import { CoolstoreCookiesService } from '../coolstore-cookies.service';
import { CoolStoreProductsService } from '../coolstore-products.service';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  likeProductsListFromCookie = new Array;
  coolStoreService:CoolStoreProductsService;
  cookieService: CookieService;
  cartService:CartService;
  coolstoreCookiesService:CoolstoreCookiesService;
  
  productIdFromRoute:string;  
  currentProduct;
  isProductLiked = false;
  testBrowser: boolean;
  
  constructor(coolStoreService:CoolStoreProductsService, cookieService: CookieService,
    coolstoreCookiesService:CoolstoreCookiesService, cartService:CartService, private route: ActivatedRoute, @Inject(PLATFORM_ID) platformId:string) {
    this.coolStoreService = coolStoreService;
    this.cartService = cartService;
    this.cookieService = cookieService;
    this.coolstoreCookiesService = coolstoreCookiesService;
    this.testBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    console.log("routeParams", routeParams)
    this.productIdFromRoute = String(routeParams.get('itemId'));
    console.log("productIdFromRoute", this.productIdFromRoute)
    if (this.testBrowser) {
      this.getProductDetails();
    }
  }
  
  getProductDetails() {
    this.coolStoreService.getProductDetailsByIds(this.productIdFromRoute)
    .subscribe(product => {
      this.currentProduct = product[0]; 
      this.setupProductLikes();
      console.log("this.currentProduct ", this.currentProduct)
    } 
    );            
  }
 
   setupProductLikes(){
    this.isProductLiked = this.coolstoreCookiesService.isProductLiked(this.currentProduct.itemId);
   }
 
   saveUserLike(event, product) {
     this.coolstoreCookiesService.saveUserLike(event, product);
     this.isProductLiked = true;

  }
   
  removeProductLike(event, product) {
    this.coolstoreCookiesService.removeProductLike(event, product);
    this.isProductLiked = false;
}
  
   addToCart(event, product) {
     this.cartService.addProductToCart(product);
     console.log(product);
   }
}
