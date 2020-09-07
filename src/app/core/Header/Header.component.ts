import { Component, OnInit, AfterViewInit, ViewEncapsulation, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AdminMenuItems } from '../AdminHeader/admin-menu-items';
import { UserService } from '../../services/user-service';
import { User } from '../../models/user';

declare var $: any;

@Component({
   selector: 'app-header',
   templateUrl: './Header.component.html',
   styleUrls: ['./Header.component.scss'],
   encapsulation: ViewEncapsulation.None,
   // changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent implements OnInit, AfterViewInit {

   private _router: Subscription;
   url: string;
   user: User;
   collapsed = false;
   isFixedClass: boolean = false;

   constructor(public adminMenuItems: AdminMenuItems, public userService: UserService, public router: Router, protected cdRef: ChangeDetectorRef) { }

   ngAfterViewInit() {
      let navbar_visible = $("#navbar_global").is(":visible");

      $(window).resize(() => {
         navbar_visible = $("#navbar_global").is(":visible");
         this.collapsed = !navbar_visible;
      });
   }

   get show() {
      const isMobile = typeof (window as any).isMobile === 'function' && (window as any).isMobile();
      if (isMobile && this.userService.modalShowing) {
         return false;
      }
      return true;
   }

   ngOnInit() {
      const interval = setInterval(() => {
         if (this.userService.user) {
            this.user = this.userService.user;
            // this.cdRef.markForCheck();
            clearInterval(interval);
         }
      });
   }

   get img() {
      if (this.userService.user) {
         return this.userService.user.avatar;
      }
      return 'assets/images/avatar-placeholder.png';
      // return '../../../assets/images/thumb-4.jpg';
   }

   get name() {
      if (this.user && (this.user.firstName || this.user.lastName)) {
         return this.user.firstName + ' ' + this.user.lastName;
      }
      return 'Name unknown';
   }

   async logout() {
      await this.userService.signOut();
      return this.router.navigateByUrl('/');
   }

   isFixedHeader() {
      if (this.url === '/listing/half-map/grid' || this.url === '/listing/half-map/list') {
         return true;
      } else {
         return false
      }
   }
}
