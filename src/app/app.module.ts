import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import {  AuthStateResult, EventTypes, OidcClientNotification, OidcSecurityService, PublicEventsService } from 'angular-auth-oidc-client';

import { HeaderComponent } from './header/header.component';
import { AppComponent } from './app.component';
import { TabsComponent } from './tabs/tabs.component';
import { ListComponent } from './list/list.component';
import { ItemComponent } from './item/item.component';
import { CoolStoreProductsService } from './coolstore-products.service';
import { LogService } from './log.service';
import { CartComponent } from './cart/cart.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { CookieService } from 'ngx-cookie-service';
import { ProductRecommendationComponent } from './product-recommendation/product-recommendation.component';
import { HttpErrorHandler } from './http-error-handler.service';
import { MessageService } from './message.service';
import { HomeComponent } from './home/home.component';
import { AppConfigService } from './providers/app-config.service'
import { CoolstoreCookiesService } from './coolstore-cookies.service';
import { YourFavouritesComponent } from './your-favourites/your-favourites.component';
import { CartService } from './cart.service';
import { CheckoutComponent } from './checkout/checkout.component';
import { LoginService } from './login.service';
import { CustomerService } from './customer.service'
import { OrderService } from './order.service';
import { AppRoutingModule } from './app-routing.module';
import { AuthConfigModule } from './auth-config.module';
import { filter } from 'rxjs';


export function initConfig(appConfig: AppConfigService) {
  return () => appConfig.loadConfig();
}



@NgModule({
  declarations: [
    AppComponent,
    TabsComponent,
    ListComponent,
    ItemComponent,
    CartComponent,
    HeaderComponent,
    ProductDetailComponent,
    ProductRecommendationComponent,
    HomeComponent,
    YourFavouritesComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    FormsModule, ReactiveFormsModule,
    AppRoutingModule, AuthConfigModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER, useFactory: initConfig,  deps: [AppConfigService],  multi: true
    },
    CoolStoreProductsService, LogService, CookieService, HttpErrorHandler, MessageService, 
    CoolstoreCookiesService, CartService, LoginService, CustomerService, OrderService, OidcSecurityService
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
  constructor(private readonly eventService: PublicEventsService) {
    this.eventService
      .registerForEvents()
      .pipe(filter((notification) => notification.type === EventTypes.NewAuthenticationResult))
      .subscribe((result: OidcClientNotification<AuthStateResult>) => {
        console.log("AuthStateResult", result)
        
      });
  }
}
