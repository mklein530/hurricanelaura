import { Directive, HostListener } from '@angular/core';
import { UserService } from '../services/user-service';

@Directive({
  selector: '[appGoogleSignin]',
})
export class GoogleSigninDirective {
  constructor(private userService: UserService) {}

  @HostListener('click')
  onclick() {
    this.userService.googleSignIn();
  }
}
