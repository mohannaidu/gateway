import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager, JhiAlertService } from 'ng-jhipster';

import { Stock } from './stock.model';
import { StockService } from './stock.service';
import { Principal } from '../../shared';

@Component({
    selector: 'jhi-stock',
    templateUrl: './stock.component.html'
})
export class StockComponent implements OnInit, OnDestroy {
    stocks: Stock[];
    currentAccount: any;
    eventSubscriber: Subscription;

    constructor(
        private stockService: StockService,
        private jhiAlertService: JhiAlertService,
        private eventManager: JhiEventManager,
        private principal: Principal
    ) {
    }

    loadAll() {
        this.stockService.query().subscribe(
            (res: HttpResponse<Stock[]>) => {
                this.stocks = res.body;
            },
            (res: HttpErrorResponse) => this.onError(res.message)
        );
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInstocks();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: Stock) {
        return item.id;
    }
    registerChangeInstocks() {
        this.eventSubscriber = this.eventManager.subscribe('stockListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
