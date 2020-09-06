import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { UserService } from './services/user-service';

const canAccess = ['home', 'login', 'signup'];
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private myRoute: Router) { }
  async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    console.log(next, state);
    if (this.userService.user) {
      return true;
    }
    if (canAccess.find((route) => state.url.includes(route))) {
      await this.resolveUser();
      return true;
    }
    if (await this.resolveUser()) {
      return true;
    }
    this.routeToLogin();
    return false;
  }

  async resolveUser() {
    const user = await this.userService.doAutoLogin();
    if (this.userService.user) {
      return true;
    }
    return false;
  }

  routeToLogin() {
    return this.myRoute.navigateByUrl('/');
  }
}
