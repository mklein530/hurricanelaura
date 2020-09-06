import { Injectable } from '@angular/core';
import { UserService } from '../../services/user-service';
import { User } from '../../models/user';

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
    state: ['admin', 'add-list'],
    name: 'Add Request',
    type: 'link',
    children: []
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
  {
    state: ['pages', 'user-profile'],
    name: 'My Profile',
    type: 'link',
    children: []
  }
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
  withRegistration = [...MENUITEMS, {
    state: ['session', 'signup'],
    name: 'Register',
    type: 'link',
    children: []
  }];


  constructor(protected userService: UserService) {
    this.user = this.userService.user;
  }

  getAll() {
    if (!this.user) {
      return this.withRegistration
    }
    return MENUITEMS;
  }
}
