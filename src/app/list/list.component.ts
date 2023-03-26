import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { CoolStoreProductsService } from '../coolstore-products.service';
import { PaginatedProductsList } from '../models/product.model';
import serverEnvConfig from "client.env.config";

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit {

  testBrowser: boolean;
  products = new PaginatedProductsList();
  paginationLimit = serverEnvConfig.ANGULR_API_GETPAGINATEDPRODUCTS_LIMIT; //number of products per page


  coolStoreService: CoolStoreProductsService;
  subscription:Subscription;
  page = 1;

  constructor(coolStoreService:CoolStoreProductsService, @Inject(PLATFORM_ID) platformId:string) {
    this.testBrowser = isPlatformBrowser(platformId);
    this.coolStoreService  = coolStoreService;
  }


  ngOnInit(): void {
    if (this.testBrowser) {
      this.fetchPaginatedProductsList(1);
    }
  }

  fetchPaginatedProductsList(page) {

    this.coolStoreService.fetchPaginatedProductsList(page) 
      .subscribe(products => (this.products = products));


  }


  loadPage(event){
    if(this.page != event) {
      this.page = event;
      this.fetchPaginatedProductsList(event);
      console.log("this.products", this.products)
    }
  }



}
