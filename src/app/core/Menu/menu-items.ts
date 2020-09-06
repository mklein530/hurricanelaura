import { Injectable } from '@angular/core';
import { UserService } from '../../services/user-service';
import { User } from '../../models/user';

declare var $: any;
export interface Menu {
  state: string;
  name: string;
  type?: string;
  children?: Menu[];
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
  user: User = null;
  collapsed = false;
  withRegistration = [...MENUITEMS, {
    state: ['session', 'signup'],
    name: 'Register',
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

  constructor(protected userService: UserService) {
    this.user = this.userService.user;
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
    if (!this.user) {
      return [...this.withRegistration, ...collapsedItems];
    }
    return [...MENUITEMS, ...collapsedItems];
  }
}
