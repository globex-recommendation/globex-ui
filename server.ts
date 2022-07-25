import 'zone.js/dist/zone-node';

import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { APP_BASE_HREF } from '@angular/common';
import { existsSync } from 'fs';

import { PaginatedProductsList } from 'src/app/models/product.model';
import { AxiosError } from 'axios';

import { get } from 'env-var';


// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  console.log("Express server side setup is complete....")
  const server = express();
  const distFolder = join(process.cwd(), 'dist/globex-ui/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';


  //setup pathways
  //client UI to SSR calls
  const ANGULR_API_GETPAGINATEDPRODUCTS =  '/api/getPaginatedProducts';
  const ANGULR_API_GETPAGINATEDPRODUCTS_LIMIT = 8
  const ANGULR_API_GETRECOMMENDEDPRODUCTS =  '/api/getRecommendedProducts'
  const ANGULR_API_TRACKUSERACTIVITY = '/api/trackUserActivity'
  const ANGULR_API_GETPRODUCTDETAILS_FOR_IDS = '/api/getProductDetailsForIds'


  const RECOMMENDED_PRODUCTS_LIMIT = get('RECOMMENDED_PRODUCTS_LIMIT').default(5).asInt();
  
  const NODE_ENV = get('NODE_ENV').default('dev').asEnum(['dev', 'prod']);
  const LOG_LEVEL = get('LOG_LEVEL').asString();


  // HTTP and WebSocket traffic both use this port
  const  PORT = get('PORT').default(4200).asPortNumber();

  // external micro services typically running on OpenShift
  const API_MANAGEMENT_FLAG = get('API_MANAGEMENT_FLAG').default("NO").asString();  
  const API_TRACK_USERACTIVITY = get('API_TRACK_USERACTIVITY').default('https://d8523dbb-977d-4d5c-be98-aef3da676192.mock.pstmn.io/track').asString();  
  const API_GET_PAGINATED_PRODUCTS = get('API_GET_PAGINATED_PRODUCTS').default('https://3ea8ea3c-2bc9-45ae-9dc9-73aad7d8eafb.mock.pstmn.io/services/products').asString();  
  const API_GET_PRODUCT_DETAILS_BY_IDS = get('API_GET_PRODUCT_DETAILS_BY_IDS').default('https://3ea8ea3c-2bc9-45ae-9dc9-73aad7d8eafb.mock.pstmn.io/services/product/list/').asString();  
  const API_CATALOG_RECOMMENDED_PRODUCT_IDS = get('API_CATALOG_RECOMMENDED_PRODUCT_IDS').default('https://e327d0a8-a4cc-4e60-8707-51a295f04f76.mock.pstmn.io/score/product').asString();
  const API_USER_KEY_NAME = get('USER_KEY').default('api_key').asString();
  const API_USER_KEY_VALUE = get('API_USER_KEY_VALUE').default('8efad5cc78ecbbb7dbb8d06b04596aeb').asString();

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);


  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  
  // Example Express Rest API endpoints
  //const http = require('http');
  const bodyParser = require('body-parser');
  const axios = require('axios');
  
  if(API_MANAGEMENT_FLAG && API_MANAGEMENT_FLAG =='YES') {
    axios.defaults.headers.common[API_USER_KEY_NAME] = API_USER_KEY_VALUE // for all requests
  }

  server.use(bodyParser.json());
  server.use(bodyParser.urlencoded({extended: true}) );
  

  //API Setup START
  //Get Paginated Products
  
  server.get(ANGULR_API_GETPAGINATEDPRODUCTS, (req, res) => {
    /* console.log("SSR:::: O/P from '/api/getPaginatedProducts' invoked from server.ts with req.params", req.query['page'] 
    + 'with URL as' + API_GET_PAGINATED_PRODUCTS + "?" + req.query['page']  + "&limit=" +req.query['limit'] ) */
    var getProducts:PaginatedProductsList;
    var myTimestamp = new Date().getTime().toString();
    var url = API_GET_PAGINATED_PRODUCTS.toString();
    var limit = req.query['limit'];
    var page = req.query['page'];

    console.debug("URL called is: ", url);
    axios.get(url, {params: { limit: limit, timestamp:myTimestamp , page: page } })
      .then(response => {
        getProducts =  response.data;;
        res.send(getProducts);
      })
      .catch(error => {
        console.log("ANGULR_API_GETPAGINATEDPRODUCTS", error);
      });
  });


  // Get Product Details for the comma separated Product IDs string
  server.get(ANGULR_API_GETRECOMMENDEDPRODUCTS, (req, res) => {
    //console.debug('SSR:::: erEnvConfig.ANGULR_API_GETRECOMMENDEDPRODUCTS ' + ANGULR_API_GETRECOMMENDEDPRODUCTS+ ' invoked');
    var commaSeparatedProdIds;
    var recommendedProducts= [];
    var getRecommendedProducIdsURL = API_CATALOG_RECOMMENDED_PRODUCT_IDS;
    var getProdDetailsByIdURL = API_GET_PRODUCT_DETAILS_BY_IDS;
    var getRecommendedProducts;
    axios
      .get(getRecommendedProducIdsURL)
      .then(response => {
        getRecommendedProducts =  response.data;
        //console.debug("getRecommendedProducts ID", getRecommendedProducts )

        //get a list of Product Ids from the array sent
        var prodArray = getRecommendedProducts.map(s=>s.productId);        

        commaSeparatedProdIds = prodArray.toString();
        //console.debug("commaSeparatedProdIds", commaSeparatedProdIds);

        return axios.get(getProdDetailsByIdURL + commaSeparatedProdIds);
      })
      .then(response => {
        var prodDetailsArray = response.data;
        var returnData = getRecommendedProducts.map(t1 => ({...t1, ...prodDetailsArray.find(t2 => t2.itemId === t1.productId)}))
        returnData = returnData.slice(0,RECOMMENDED_PRODUCTS_LIMIT);
        res.send(returnData);
      }).catch(error => { console.log("ANGULR_API_GETRECOMMENDEDPRODUCTS", error); });
  });
  
  
  // Get Product Details based on Product IDs
  server.get(ANGULR_API_GETPRODUCTDETAILS_FOR_IDS, (req, res) => {
    //console.log('SSR:::: ANGULR_API_GETPRODUCTDETAILS_FOR_IDS ' + ANGULR_API_GETPRODUCTDETAILS_FOR_IDS+ ' invoked');
    var commaSeparatedProdIds =  req.query["productIds"]
    var url = API_GET_PRODUCT_DETAILS_BY_IDS;
    axios
      .get(url + commaSeparatedProdIds)
      .then(response => {
        //console.log("ANGULR_API_GETPRODUCTDETAILS_FOR_IDS for ids" + commaSeparatedProdIds, response.data); 
        res.send(response.data);
      })
      .catch(error => { console.log("ANGULR_API_GETPRODUCTDETAILS_FOR_IDS", error); });
  });

  
  // Save user activity
  
  server.post(ANGULR_API_TRACKUSERACTIVITY, (req, res) => {
    //console.log('SSR::::' + ANGULR_API_TRACKUSERACTIVITY+ ' invoked');
    var url = API_TRACK_USERACTIVITY;
    axios
      .post(url, req.body)
      .then(response => {
        res.send(response.data);
      })
      .catch(
        (reason: AxiosError<{additionalInfo:string}>) => {
          if (reason.response!.status === 400) {
            // Handle 400
            res.send("error:reason.response!.status " + reason.response!.status);
          } else {
            res.send("error:reason.response!.status " + reason.response!.status);
          }
          console.log("ANGULR_API_TRACKUSERACTIVITY AxiosError", reason.message)
        }
      );
  });
//API Setup END


  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));
  
  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
  });


  return server;
}



function run(): void {
 
  const port = process.env['PORT'] || 4200;
  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });


  ['log', 'warn', 'error'].forEach((methodName) => {
    const originalMethod = console[methodName];
    console[methodName] = (...args) => {
      let initiator = 'unknown place';
      try {
        throw new Error();
      } catch (e) {
        if (typeof e.stack === 'string') {
          let isFirst = true;
          for (const line of e.stack.split('\n')) {
            const matches = line.match(/^\s+at\s+(.*)/);
            if (matches) {
              if (!isFirst) { // first line - current function
                              // second line - caller (what we are looking for)
                initiator = matches[1];
                break;
              }
              isFirst = false;
            }
          }
        }
      }
      originalMethod.apply(console, [...args, '\n', `  at ${initiator}`]);
    };
  }); 
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';





