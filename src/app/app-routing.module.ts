import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AutoLoginPartialRoutesGuard } from 'angular-auth-oidc-client';
import { AuthorizationGuard } from 'src/auth-guard.service';
import { CartComponent } from './cart/cart.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { HomeComponent } from './home/home.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { TabsComponent } from './tabs/tabs.component';
import { YourFavouritesComponent } from './your-favourites/your-favourites.component';

const routes = [
    {path: 'home', component: HomeComponent},
    {path: 'products', component: TabsComponent},
    {path: 'cart', component: CartComponent},
    {path: 'product-detail/:itemId', component: ProductDetailComponent },
    {path: 'myFavourites', component: YourFavouritesComponent }, 
    {path: 'checkout', component: CheckoutComponent, canActivate: [AutoLoginPartialRoutesGuard]},
    {path: '**', redirectTo: '/home'}
  
  ];
  
  
  @NgModule({
    imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabledBlocking',})],
    exports: [RouterModule],
  })
  export class AppRoutingModule {}

  