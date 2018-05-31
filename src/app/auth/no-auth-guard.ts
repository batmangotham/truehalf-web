import { Injectable } from "@angular/core";
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";
import { Observable } from "rxjs/Rx";
import { UserService } from "../shared";
@Injectable()
export class NoAuthGuard implements CanActivate {
  constructor(private _userService: UserService, private _router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this._userService.isAuthenticated.take(1).map(auth => {
      if (auth) {
        this._router.navigateByUrl("/");
      }
      return !auth;
    });
  }
}
