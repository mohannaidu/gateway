import { NgModule } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from '../../shared/shared.module';
//import { DashboardService } from './dashboard.service';
import { DashboardService } from '../../../app/shared/stock/dashboard.service';

import {
  DashboardComponent
} from './dashboard.component';
import {
  DASHBOARD_ROUTE
} from './dashboard.route';


@NgModule({
    imports: [
        GatewaySharedModule,
        RouterModule.forChild([ DASHBOARD_ROUTE ])
    ],
    declarations: [
        DashboardComponent,
    ],
    entryComponents: [
      DashboardComponent
    ],
    providers: [
      DashboardService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class DashboardModule { }
