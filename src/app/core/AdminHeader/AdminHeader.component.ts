import { Component, OnInit, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { AdminMenuItems } from './admin-menu-items';
import { UserService } from 'src/app/services/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  templateUrl: './AdminHeader.component.html',
  styleUrls: ['./AdminHeader.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AdminHeaderComponent implements OnInit {
  constructor(public adminMenuItems: AdminMenuItems, public userService: UserService, public router: Router) { }

  ngOnInit() { }

  get user() {
    return this.userService.user;
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

  ngAfterViewInit() { }

  async logout() {
    await this.userService.signOut();
    return this.router.navigateByUrl('/');
  }
}
