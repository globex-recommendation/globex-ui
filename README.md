# GlobexUi

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.5.
This also has "Server-side rendering (SSR) with Angular Universal" enables. Read more about this here: https://angular.io/guide/universal

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Running on Server Side

Run `npm run dev:ssr` for running this as server side app. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.


## To run in a local setup: these env variables are needed
Run the globex-store  globex-db images locally and setup these URLs

export API_TRACK_USERACTIVITY="http://localhost:9000/track"

export API_GET_PAGINATED_PRODUCTS="http://localhost:9000/services/catalog/product"

export API_GET_PRODUCT_DETAILS_BY_IDS="http://localhost:9000/services/catalog/product/:ids" 

export API_CATALOG_RECOMMENDED_PRODUCT_IDS="http://localhost:9000/score/product"

export API_CART_SERVICE="http://localhost:9000/services/cart"

export API_CUSTOMER_SERVICE="http://localhost:9000/services/customer/id/:custId"

export API_ORDER_SERVICE="http://localhost:8080/web-gateway/services/order"