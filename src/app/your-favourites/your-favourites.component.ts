import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../cart.service';
import { CoolstoreCookiesService } from '../coolstore-cookies.service';
import { CoolStoreProductsService } from '../coolstore-products.service';

@Component({
  selector: 'app-your-favourites',
  templateUrl: './your-favourites.component.html',
  styleUrls: ['./your-favourites.component.css']
})

export class YourFavouritesComponent implements OnInit {


  products:any;
  
  
  coolStoreService: CoolStoreProductsService;
  loadedSide = '';
  subscription:Subscription;
  page = 1;
  cartService:CartService;
  coolstoreCookiesService: CoolstoreCookiesService;
  likeProductsString:string;

  constructor(coolStoreService:CoolStoreProductsService, coolstoreCookiesService: CoolstoreCookiesService, cartService:CartService) {
    this.coolStoreService  = coolStoreService;
    this.coolstoreCookiesService = coolstoreCookiesService;
    this.cartService = cartService;
  }


  ngOnInit(): void {
    this.coolstoreCookiesService.getAllProductLikes()
    this.likeProductsString =  this.coolstoreCookiesService.likeProductsListFromCookie.join();

    this.fetchFavouriteProductsList(1);
  }

  fetchFavouriteProductsList(page) {
    
    this.coolStoreService.getProductDetailsByIds(this.likeProductsString)
      .subscribe(products => (this.products = products));
      
      
  }


 


}
