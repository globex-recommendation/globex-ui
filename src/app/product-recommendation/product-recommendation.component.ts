import { Component, Input, OnInit } from '@angular/core';
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


  constructor(coolStoreService:CoolStoreProductsService, logService:LogService) {
    this.coolStoreService = coolStoreService;
    this.logService = logService;
  }

  ngOnInit(): void {
    this.fetchRecommendedProducts();
  }

  
  fetchRecommendedProducts() {
    this.coolStoreService.getRecommendedProducts()
      .subscribe(products => (this.recommendedProducts = products));
      
  }


}
