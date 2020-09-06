import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuItems } from './menu-items';
import { UserService } from '../../services/user-service';
import { User } from '../../models/user';
declare var $: any;

@Component({
   selector: 'app-menu',
   templateUrl: './Menu.component.html',
   styleUrls: ['./Menu.component.scss'],
   encapsulation: ViewEncapsulation.None
})
export class MenuComponent implements OnInit {
   user: User = null;
   selectedMenu: any = null;
   selectedSubMenu: any = null;
   constructor(public menuItems: MenuItems, private router: Router, protected userService: UserService) {
      this.router.events.subscribe((ev) => {
         if (ev instanceof NavigationEnd) {
            $('#navbar_global').removeClass('show');
         }
      });
   }

   ngOnInit() {
      this.user = this.userService.user;
   }

   menuClick(value) {
      if (this.selectedMenu == value) {
         this.selectedMenu = null;
      }
      else {
         this.selectedMenu = value;
      }
   }

   subMenuClick(value) {
      if (this.selectedSubMenu == value) {
         this.selectedSubMenu = null;
      }
      else {
         this.selectedSubMenu = value;
      }
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

   routerLink(value: string | string[]) {
      if (Array.isArray(value)) {
         return ['/', ...value];
      }
      return ['/', value];
   }

   logout() {
      this.userService.logout();
      this.router.navigate(['/']);
   }
}
