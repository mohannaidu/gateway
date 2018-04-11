import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { GatewaySharedModule } from '../../shared';

import {
    LandingService,
} from './landing.service';

import {
    LandingComponent,
} from './landing.component';

import {
    landingRoute
} from './landing.route';

const ENTITY_STATES = [
    ...landingRoute
];

@NgModule({
    imports: [
        GatewaySharedModule,
        RouterModule.forChild(ENTITY_STATES)
    ],
    declarations: [
        LandingComponent,
    ],
    entryComponents: [
        LandingComponent
    ],
    providers: [
        LandingService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GatewayLandingModule {}
