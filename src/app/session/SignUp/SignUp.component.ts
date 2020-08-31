import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'signup',
  templateUrl: './SignUp.component.html',
  styleUrls: ['./SignUp.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignUpComponent implements OnInit {

  constructor(protected router: Router) { }

  ngOnInit() { }

  ngAfterViewInit() {

  }

  routeToLogin() {
    return this.router.navigate(['login'])
  }
}
