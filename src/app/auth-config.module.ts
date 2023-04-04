import { HttpClient } from '@angular/common/http';
import { Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { AuthModule, StsConfigHttpLoader, StsConfigLoader } from 'angular-auth-oidc-client';
import config from 'client.env.config';
import { map } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

let platform: string;
export function setPlatform(value) {
  platform = value;
}
export function getPlatform() {
  return platform;
}

export const httpLoaderFactory = (httpClient: HttpClient) => {
  //if(getPlatform()=='browser') 
  {
  const config$ = httpClient.get<any>(config.ANGULAR_API_AUTHCONFIG).pipe(
    map((customConfig: any) => {
      return {
        clientId: customConfig[config.SSO_CUSTOM_CONFIG_KEY],
        authority: customConfig[config.SSO_AUTHORITY_KEY],
        redirectUrl: customConfig[config.SSO_REDIRECT_LOGOUT_URI_KEY],
        postLogoutRedirectUri: customConfig[config.SSO_REDIRECT_LOGOUT_URI_KEY],
        logLevel: customConfig[config.SSO_LOG_LEVEL_KEY],
        postLoginRoute: '/home',
        historyCleanupOff: true,
        scope: 'openid profile email offline_access',
        responseType: 'id_token token',        
        silentRenew: true,
        useRefreshToken: true        
      };
    })
  );
  return new StsConfigHttpLoader(config$);
}
//return null;
  
};


@NgModule({
  imports: [
    AuthModule.forRoot({
      loader: {
        provide: StsConfigLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [AuthModule],
})
export class AuthConfigModule {
  isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
  constructor(@Inject(PLATFORM_ID) private readonly platformId: string) {
    setPlatform(platformId);

  }
}
