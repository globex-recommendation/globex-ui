import { Component } from '@angular/core';
import { CartService } from '../cart.service';
import { CoolstoreCookiesService } from '../coolstore-cookies.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  {
  
  cartService:CartService;
  coolstoreCookiesService:CoolstoreCookiesService;
  isMenuCollapsed:boolean;


  constructor(cartService:CartService, coolstoreCookiesService:CoolstoreCookiesService,
    private formBuilder: FormBuilder) {
    this.cartService = cartService;
    this.coolstoreCookiesService = coolstoreCookiesService;
  }
  
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.isMenuCollapsed = true;

}
  
  retrieveUserDetailsFromCookie() {
    return this.coolstoreCookiesService.retrieveUserDetailsFromCookie();
  }

  getTotalCartValue() {
    return this.cartService.getTotalCartValue();
  }

  getItemsCountOfProductsInCart() {
    return this.cartService.getTotalProductsQuantityInCart()
  }

  //login code
  showModal: boolean;
  loginForm: FormGroup;
  submitted = false;
  show()   {
    this.showModal = true; // Show-Hide Modal Check
    
  }
  hide()  {
    this.showModal = false;
  }
  login(){
    this.coolstoreCookiesService.user.isUserLoggedIn = true;
    this.coolstoreCookiesService.user.email = this.loginForm.get("email").value;
    this.showModal = false;
    this.cartService.mergeCart();
  }

  logout(){
    this.coolstoreCookiesService.user.isUserLoggedIn = false;
    this.coolstoreCookiesService.user.email = ''
    this.loginForm.reset();
    this.cartService.unsync();
  }

  // convenience getter for easy access to form fields
get f() { return this.loginForm.controls; }
onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }
    if(this.submitted)
    {
      this.showModal = false;
    }
   
}

}
