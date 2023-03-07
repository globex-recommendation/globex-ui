import { Component } from '@angular/core';
import { CartService } from '../cart.service';
import { CoolstoreCookiesService } from '../coolstore-cookies.service';
import { LoginService } from '../login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  {

  cartService: CartService;
  coolstoreCookiesService: CoolstoreCookiesService;
  loginService: LoginService
  customerService: CustomerService
  isMenuCollapsed:boolean;


  constructor(cartService: CartService, coolstoreCookiesService: CoolstoreCookiesService, loginService: LoginService,
    customerService: CustomerService, private formBuilder: FormBuilder) {
    this.cartService = cartService;
    this.coolstoreCookiesService = coolstoreCookiesService;
    this.loginService = loginService;
    this.customerService = customerService;
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
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

  login() {
    let username = this.loginForm.get("username").value;
    let password = this.loginForm.get("password").value;
    this.loginService.login(username, password)
      .subscribe(success => {
        if (success) {
          this.showModal = false;
          this.coolstoreCookiesService.setUserFromCookies();
          this.cartService.mergeCart();
        } else {
          this.showModal = true;
        }
      });
  }

  logout() {
    this.loginService.logout()
      .subscribe(success => {
        this.coolstoreCookiesService.resetUser();
        this.loginForm.reset();
        this.cartService.unsync();
      });
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
