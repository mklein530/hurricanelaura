import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';
declare var $: any;

@Component({
   selector: 'app-admin-sidebar',
   templateUrl: './AdminSidebar.component.html',
   styleUrls: ['./AdminSidebar.component.scss'],
   encapsulation: ViewEncapsulation.None
})
export class AdminSidebarComponent implements OnInit {

   // sidebarIn : boolean = false;
   constructor(protected userService: UserService, protected router: Router) { }

   ngOnInit() { }

   ngAfterViewInit() {

   }

   async logout() {
      await this.userService.logout();
      return this.router.navigate(['/home']);
   }

   toggleMenu() {
      if ($('app-admin-panel').hasClass("sidebar-in")) {
         $('app-admin-panel').removeClass("sidebar-in");
      }
      else {
         $('app-admin-panel').addClass("sidebar-in");
      }
      // this.sidebarIn = !this.sidebarIn;
   }
}
