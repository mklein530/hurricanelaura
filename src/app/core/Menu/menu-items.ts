import { Injectable } from '@angular/core';
import { UserService } from '../../services/user-service';
import { User } from '../../models/user';

declare var $: any;
export interface Menu {
  state: string;
  name: string;
  type?: string;
  children?: Menu[];
  click?: () => any;
}

const MENUITEMS = [
  {
    state: 'home',
    name: 'Home',
    type: 'link',
    children: [
      // { state: 'version1', name: 'Home Version 1', type: 'link' },
      // { state: 'version2', name: 'Home Version 2', type: 'link' }
    ]
  },
  {
    state: ['admin', 'list'],
    name: 'Dashboard',
    type: 'link',
    // children: []
  },
  {
    state: ['listing', 'list', 'full-width'],
    name: 'Requests',
    type: 'link',
    children: []
  },
  {
    state: ['listing', 'grid', 'full-width'],
    name: 'Helpers',
    type: 'link',
    children: []
  },
  // {
  //   state: 'session',
  //   name: 'Session',
  //   type: 'sub',
  //   children: [
  //     { state: 'login', name: 'Login', type: 'link' },
  //     { state: 'signup', name: 'Register', type: 'link' },
  //   ]
  // }
];


@Injectable()
export class MenuItems {
  user: firebase.User = null;
  collapsed = false;
  withRegistration = [...MENUITEMS, {
    state: ['session', 'login'],
    name: 'Login',
    type: 'link',
    children: []
  }];
  profile = {
    state: ['pages', 'user-profile'],
    name: 'My Profile',
    type: 'link',
    children: []
  };
  addRequest = {
    state: ['admin', 'add-list'],
    name: 'Add Request',
    type: 'link',
    children: []
  };
  logout = {
    state: ['session', 'login'],
    name: 'Logout',
    type: 'link',
    children: [],
    click: () => this.userService.logout()
  }

  constructor(protected userService: UserService) {
    this.user = this.userService.fbUser;
  }

  afterInit() {
    let navbar_visible = $("#navbar_global").is(":visible");
    this.collapsed = !navbar_visible;
    $(window).resize(() => {
      navbar_visible = $("#navbar_global").is(":visible");
      this.collapsed = !navbar_visible;
    });
  }

  getAll() {
    const collapsedItems = this.collapsed ? [this.addRequest, this.profile] : [];
    if (this.user && !this.user.isAnonymous && this.collapsed) {
      collapsedItems.push(this.logout);
    }
    if (!this.user || this.user.isAnonymous) {
      return [...this.withRegistration, ...collapsedItems];
    }
    return [...MENUITEMS, ...collapsedItems];
  }
}
