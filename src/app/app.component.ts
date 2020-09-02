import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user-service';
import { Router } from '@angular/router';
declare var FB: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(protected userService: UserService, protected router: Router) {}

  // initFbSDK() {
  //   // @ts-ignore
  //   window.fbAsyncInit = function() {
  //     FB.init({
  //       appId      : '{your-app-id}',
  //       cookie     : true,
  //       xfbml      : true,
  //       version    : 'v8.0'
  //     });

  //     FB.AppEvents.logPageView();

  //   };

  //   (function(d, s, id){
  //      var js, fjs = d.getElementsByTagName(s)[0];
  //      if (d.getElementById(id)) {return;}
  //      js = d.createElement(s); js.id = id;
  //      js.src = "https://connect.facebook.net/en_US/sdk.js";
  //      fjs.parentNode.insertBefore(js, fjs);
  //    }(document, 'script', 'facebook-jssdk'));
  // }

  async ngOnInit() {
    // const user = await this.userService.doAutoLogin();
    // if (user) {
    //   // return this.router.navigateByUrl('/home');
    // }
  }
}
