import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Sector } from './sector.model';
import { SectorService } from './sector.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-sector',
    templateUrl: './sector.component.html'
})
export class SectorComponent implements OnInit, OnDestroy {
sectors: Sector[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private sectorService: SectorService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.sectorService.query().subscribe(
            (res: HttpResponse<Sector[]>) => {
                this.sectors = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInSectors();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Sector) {
        return item.id;
    }
    registerChangeInSectors() {
        this.eventSubscriber = this.eventManager.subscribe('sectorListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
