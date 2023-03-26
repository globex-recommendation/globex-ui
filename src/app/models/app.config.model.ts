import { LogLevel } from "angular-auth-oidc-client";

export class AppConfig {
    
    authority: string;
    redirectUrl: string;
    clientId: string;
    responseType: string;
    scope: string;
    postLogoutRedirectUri: string;
    postLoginRoute: string;
    logLevel: LogLevel.Debug;
    maxIdTokenIatOffsetAllowedInSeconds: string;
    historyCleanupOff: true;

    constructor() {}
}