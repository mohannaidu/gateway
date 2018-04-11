import {Route} from '@angular/router';

import {HomeComponent} from './';

export const HOME_ROUTE: Route = {
//  path: '',
//  component: HomeComponent,
//  data: {
//    authorities: ['ROLE_ADMIN'],
//    pageTitle: 'home.title'
//  }

  path: '',
  redirectTo: 'landing',
  pathMatch: 'full',
  data: {
    authorities: ['ROLE_ADMIN'],
    pageTitle: 'home.title'

  }
};
