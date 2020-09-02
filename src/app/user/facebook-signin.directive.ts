import { Directive, HostListener } from '@angular/core';
import { UserService } from '../services/user-service';

@Directive({
  selector: '[appFacebookSignin]',
})
export class FacebookSigninDirective {
  constructor(private userService: UserService) {}

  @HostListener('click')
  onclick() {
    this.userService.facebookSignIn();
  }
}
