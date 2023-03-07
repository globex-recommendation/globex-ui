import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';


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


export function initConfig(appConfig: AppConfigService) {
  return () => appConfig.loadConfig();
}

const routes = [
  {path: 'home', component: HomeComponent},
  {path: 'products', component: TabsComponent},
  {path: 'cart', component: CartComponent},
  {path: 'product-detail/:itemId', component: ProductDetailComponent},
  {path: 'myFavourites', component: YourFavouritesComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: '**', redirectTo: '/home'}

];

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
    RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking'
}),
    HttpClientModule,
    NgbModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER, useFactory: initConfig,  deps: [AppConfigService],  multi: true
    },
    CoolStoreProductsService, LogService, CookieService, HttpErrorHandler, MessageService, CoolstoreCookiesService, CartService, LoginService, CustomerService, OrderService],
  bootstrap: [AppComponent]
})

export class AppModule {
}
