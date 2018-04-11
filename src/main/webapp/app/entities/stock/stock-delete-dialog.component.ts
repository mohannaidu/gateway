import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { Stock } from './stock.model';
import { StockPopupService } from './stock-popup.service';
import { StockService } from './stock.service';

@Component({
    selector: 'jhi-stock-delete-dialog',
    templateUrl: './stock-delete-dialog.component.html'
})
export class StockDeleteDialogComponent {

    stock: Stock;

    constructor(
        private stockService: StockService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id: number) {
        this.stockService.delete(id).subscribe((response) => {
            this.eventManager.broadcast({
                name: 'stockListModification',
                content: 'Deleted an stock'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-stock-delete-popup',
    template: ''
})
export class StockDeletePopupComponent implements OnInit, OnDestroy {

    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private stockPopupService: StockPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.stockPopupService
                .open(StockDeleteDialogComponent as Component, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
