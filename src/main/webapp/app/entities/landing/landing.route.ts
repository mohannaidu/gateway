import { Routes } from '@angular/router';

import { UserRouteAccessService } from '../../shared';
import { LandingComponent } from './landing.component';

export const landingRoute: Routes = [
    {
        path: 'landing',
        component: LandingComponent,
        data: {
            authorities: ['ROLE_USER'],
             pageTitle: 'UOB KayHian - Login'
            //pageTitle: 'gatewayApp.landing.home.title'
        }
//        ,canActivate: [UserRouteAccessService]
    }
];


