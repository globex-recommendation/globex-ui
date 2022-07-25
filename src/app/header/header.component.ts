import { Component } from '@angular/core';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  {
  
  cartService:CartService

  constructor(cartService:CartService) {
    this.cartService = cartService;
  }

  

  getTotalCartValue() {
    return this.cartService.getTotalCartValue();
  }

  getItemsCountOfProductsInCart() {
    return this.cartService.getTotalProductsQuantityInCart()
  }

}
