import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './Login.component.html',
  styleUrls: ['./Login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  constructor(protected router: Router) { }

  ngOnInit() { }

  ngAfterViewInit() {

  }

  routeToSignup() {
    return this.router.navigate(['signup']);
  }
}
