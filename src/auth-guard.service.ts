import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChildFn, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AutoLoginPartialRoutesGuard, OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable, of } from 'rxjs';
import { catchError, map, take } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })
export class AuthorizationGuard implements CanActivate {
  constructor(
    private router: Router,
    private autoLoginPartialRoutesGuard: AutoLoginPartialRoutesGuard
) {}


canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.autoLoginPartialRoutesGuard.canActivate(route, state)) {
        return true;
    }
    if (this.autoLoginPartialRoutesGuard.canActivate(route, state)) {
        this.router.navigate(['/unauthorized']);
    }
    return false;
}
}
