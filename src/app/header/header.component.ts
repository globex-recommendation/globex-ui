import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { CoolstoreCookiesService } from '../coolstore-cookies.service';
import { LoginService } from '../login.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../customer.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Router } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { HandleError, HttpErrorHandler } from '../http-error-handler.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent  implements OnInit{

  cartService: CartService;
  coolstoreCookiesService: CoolstoreCookiesService;
  loginService: LoginService
  customerService: CustomerService
  isMenuCollapsed:boolean;
  userData: any;
  loginData: {}
  loginErrorMessage:string;
  private handleError: HandleError;


  constructor(cartService: CartService, coolstoreCookiesService: CoolstoreCookiesService, loginService: LoginService,
    customerService: CustomerService, private formBuilder: FormBuilder, private oidcSecurityService:OidcSecurityService,
    private router: Router, httpErrorHandler: HttpErrorHandler) {
    this.cartService = cartService;
    this.coolstoreCookiesService = coolstoreCookiesService;
    this.loginService = loginService;
    this.customerService = customerService;
    this.handleError = httpErrorHandler.createHandleError('HeaderComponent');
  }

  ngOnInit() {
    this.isMenuCollapsed = true;   
    
    this.oidcSecurityService
      .checkAuth()
      .subscribe(({ isAuthenticated, accessToken, userData }) => {
        catchError(this.handleError('oidcSecurityService', "checkAuth"));
        if (isAuthenticated) {
          this.navigateToStoredEndpoint();
          this.login(userData["preferred_username"], accessToken);
        } else {
          this.loginService.setUserAuthenticated('', false);
          this.coolstoreCookiesService.resetUser();
        }
      });
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
  currentRoute:string;
  
  authenticateUser() {
    this.currentRoute = this.router.url;
    this.write('redirect', this.router.url);
    
    this.oidcSecurityService.authorize();
    
  }

  login(username: string, accessToken: string) {
    this.loginService.login(username, accessToken)
      .subscribe(success => {        
        if (success) {
          this.cartService.mergeCart();
        } else {
          this.showModal = true;
        }
      });
  }

  logout() {
    this.oidcSecurityService.logoff().subscribe((result) =>  { 
      this.loginService.logout()
      .subscribe(success => {
        this.coolstoreCookiesService.resetUser();
        this.cartService.unsync();
      }); 
    }
    );     
  }

  isUserAuthenticated(): boolean {
    return this.loginService.isUserAuthenticated();
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


  //these methods help to navigate back to the place from where login was initiated
  //the path is stored in localstorage
  private navigateToStoredEndpoint() {
    const path = this.read('redirect');

    if (this.router.url === path) {
      return;
    }

    if (path.toString().includes('/unauthorized')) {
      this.router.navigateByUrl('/');
    } else {
      this.router.navigateByUrl(path);
    }
  }

  private read(key: string): any {
    const data = localStorage.getItem(key);
    if (data != null) {
      return JSON.parse(data);
    }

    return;
  }

  private write(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
