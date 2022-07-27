import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CartService } from '../cart.service';
import { CoolstoreCookiesService } from '../coolstore-cookies.service';
import { CoolStoreProductsService } from '../coolstore-products.service';
import { ActivatedRoute } from '@angular/router';


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
  
  constructor(coolStoreService:CoolStoreProductsService, cookieService: CookieService,
    coolstoreCookiesService:CoolstoreCookiesService, cartService:CartService, private route: ActivatedRoute) {
    this.coolStoreService = coolStoreService;
    this.cartService = cartService;
    this.cookieService = cookieService;
    this.coolstoreCookiesService = coolstoreCookiesService;
  }

  ngOnInit(): void {
    const routeParams = this.route.snapshot.paramMap;
    this.productIdFromRoute = String(routeParams.get('itemId'));
    console.log("productIdFromRoute", this.productIdFromRoute)
    this.getProductDetails();
    //this.setupProductLikes();
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
