import { Component, OnInit, AfterViewInit, ViewEncapsulation, Input } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AdminMenuItems } from '../../core/AdminHeader/admin-menu-items';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'title-bar',
  templateUrl: './TitleBar.component.html',
  styleUrls: ['./TitleBar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class TitleBarComponent implements OnInit {

  @Input('title') Title: any = 'Dummy Title';
  @Input('subtitle') SubTitle: any = 'Dummy Sub Title';

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
    return this.router.navigateByUrl('/login');
  }
}
