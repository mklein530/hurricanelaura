import { Routes } from '@angular/router';

import { DashboardOneComponent } from './DashboardOne/DashboardOne.component';
import { DashboardTwoComponent } from './DashboardTwo/DashboardTwo.component';

export const DashboardRoutes: Routes = [
  {
    path: '',
    component: DashboardTwoComponent
  },
  {
    path: 'version1',
    component: DashboardOneComponent
  },
  {
    path: 'version2',
    component: DashboardTwoComponent
  }];
