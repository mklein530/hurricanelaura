import { Directive, HostListener } from '@angular/core';
import { UserService } from '../services/user-service';
import { Router } from '@angular/router';
import { SnackService } from '../services/snack-service';

@Directive({
  selector: '[appGoogleSignin]',
})
export class GoogleSigninDirective {
  constructor(private userService: UserService, protected router: Router, protected snackService: SnackService) { }

  @HostListener('click')
  onclick() {
    this.userService.googleSignIn().then(user => {
      if (user && user.uid) {
        this.router.navigateByUrl('/home');
      }
    }).catch(error => {
      this.snackService.authError();
    })
  }
}
