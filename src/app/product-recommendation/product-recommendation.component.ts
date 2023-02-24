import { Component, Input, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { CoolStoreProductsService } from '../coolstore-products.service';
import { LogService } from '../log.service';



@Component({
  selector: 'app-product-recommendation',
  templateUrl: './product-recommendation.component.html',
  styleUrls: ['./product-recommendation.component.css']
})
export class ProductRecommendationComponent implements OnInit {

  @Input() pageViewType:any;

  coolStoreService:CoolStoreProductsService;
  logService:LogService;
  recommendedProducts;
  subscription:Subscription;
  testBrowser: boolean;


  constructor(coolStoreService:CoolStoreProductsService, logService:LogService, @Inject(PLATFORM_ID) platformId:string) {
    this.testBrowser = isPlatformBrowser(platformId);
    this.coolStoreService = coolStoreService;
    this.logService = logService;
  }

  ngOnInit(): void {
    if (this.testBrowser) {
      this.fetchRecommendedProducts();
    }
  }

  
  fetchRecommendedProducts() {
    this.coolStoreService.getRecommendedProducts()
      .subscribe(products => (this.recommendedProducts = products));
      
  }


}
