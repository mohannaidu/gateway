import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { DateFormatPipe } from './date-format-pipe';
import { JhiEventManager } from 'ng-jhipster';
import { HttpClient } from '@angular/common/http';
import { SERVER_API_URL } from '../app.constants';
import { DashboardService } from '../../../../main/webapp/app/shared/stock/dashboard.service';
import { merge } from 'rxjs/observable/merge';

import { Account, LoginModalService, Principal } from '../shared';
import { Sector } from '../entities/sector';
import { Stock } from '../entities/sector';
import {auto} from 'angular';
import { Chart } from 'chart.js';

@Component({
    selector: 'jhi-home',
    templateUrl: './home.component.html',
    styleUrls: [
        'home.css'
    ]

})
export class HomeComponent implements OnInit {
    chart = [];
    startDate: any;
    endDate: any;
    today: any;
    oldDate: any;
    klciData: any = [];
    account: any = [];
    modalRef: NgbModalRef;
    SectorData: any = [];
    PortfolioData: any = [];
    SectorSummary: any = [];
    PortfolioSummary: any = [];
    TopStockData: Stock;
    Username: any = {};
    date: any;
    newDate: any;
    b: any;
    d: any;
    user: string;
    constructor(
        private principal: Principal,
        private loginModalService: LoginModalService,
        private eventManager: JhiEventManager,
        private http: HttpClient,
        private dashboardService: DashboardService,
    ) {
    }

    ngOnInit() {
        // Hardcoded
        this.newDate = '2018-03-28';
        // this.date = new Date();
        // this.date.setDate(this.date.getDate() - 1);
        // const dateFormatPipeFilter = new DateFormatPipe();
        // this.newDate = dateFormatPipeFilter.transform(this.date);
        this.principal.identity().then((account) => {
            this.account = account;
            const {login} = this.account;
            this.dashboardService.getPortfolio(login, this.newDate).toPromise().then((response) => {
                this.PortfolioData = response.body;
                for (let i = 0, len = this.PortfolioData.length; i < len; i++) {
                    this.PortfolioSummary.push({
                        gainers: this.PortfolioData[i].high,
                        losers: this.PortfolioData[i].low,
                        name: this.PortfolioData[i].stockInfo.name,
                        code: this.PortfolioData[i].stockInfo.code,
                        id: this.PortfolioData[i].stockInfo.id,
                        price: this.PortfolioData[i].closing,
                    });
                }
            });
        });
        this.registerAuthenticationSuccess();

        this.dashboardService.get(this.newDate).toPromise().then((response) => { console.log('response', response);
            this.SectorData = response.body;
            for (let i = 0, len = this.SectorData.length; i < len; i++) {
                this.SectorSummary.push({
                    gainers: this.SectorData[i].gainers,
                    losers: this.SectorData[i].losers,
                    name: this.SectorData[i].sectorInfo.name,
                    code: this.SectorData[i].sectorInfo.code,
                    id: this.SectorData[i].sectorInfo.id,
                    totalArticle: this.SectorData[i].totalArticle,
            });
            }
        });
        this.dashboardService.getTopStock(this.newDate).toPromise().then((response) => {
            this.TopStockData = response.body;
        });

        this.dashboardService.getPortfolio(this.account.login, this.newDate).toPromise().then((response) =>
            console.log('portfolio>>>>>>>>>>>>>>', response.body)
        );

//        this.getSevenDaysData();
//        this.getThreeMonthsData();
          this.getOneYearData();

//        this.klciIndexChart(this.startDate, this.endDate);

    }
    registerAuthenticationSuccess() {
        this.eventManager.subscribe('authenticationSuccess', (message) => {
            this.principal.identity().then((account) => {
                this.account = account;
            });
        });
    }

    isAuthenticated() {
        return this.principal.isAuthenticated();
    }

    login() {
        this.modalRef = this.loginModalService.open();
    }

    getSevenDaysData() {
      // console.log('Function  getOneDayData >>>>>>>>>>>>>>');

      this.today = new Date();

      this.startDate = this.today;
      this.oldDate = new Date();

      this.oldDate.setDate(this.today.getDate() - 7);

      const dateFormatPipeFilter = new DateFormatPipe();
      this.startDate = dateFormatPipeFilter.transform(this.oldDate);
      this.endDate = dateFormatPipeFilter.transform(this.today);

      // console.log('this.startDate >>>>>>>>>>>>>>', this.startDate);
      // console.log('this.endDate >>>>>>>>>>>>>>', this.endDate);

      this.klciIndexChart(this.startDate, this.endDate);
    }

    getThreeMonthsData() {
      // console.log('Function  getThreeMonthsData >>>>>>>>>>>>>>');

      this.today = new Date();
      this.oldDate = new Date();

      this.oldDate.setDate(this.today.getDate() - 90);

      const dateFormatPipeFilter = new DateFormatPipe();
      this.startDate = dateFormatPipeFilter.transform(this.oldDate);
      this.endDate = dateFormatPipeFilter.transform(this.today);

      // console.log('this.startDate >>>>>>>>>>>>>>', this.startDate);
      // console.log('this.endDate >>>>>>>>>>>>>>', this.endDate);

      this.klciIndexChart(this.startDate, this.endDate);
    }

    getOneYearData() {
      // console.log('Function  getOneYearData >>>>>>>>>>>>>>');

      this.today = new Date();
      this.oldDate = new Date();

      this.oldDate.setDate(this.today.getDate() - 365);

      const dateFormatPipeFilter = new DateFormatPipe();
      this.startDate = dateFormatPipeFilter.transform(this.oldDate);
      this.endDate = dateFormatPipeFilter.transform(this.today);
      // console.log('this.startDate >>>>>>>>>>>>>>', this.startDate);
      // console.log('this.endDate >>>>>>>>>>>>>>', this.endDate);
      this.klciIndexChart(this.startDate, this.endDate);
    }

    klciIndexChart(startDate, endDate) {

      this.dashboardService.getKlciIndexData(this.startDate, this.endDate).toPromise().then((response) => {

      this.klciData = response.body;
      // console.log(' ****this.klciData', response);
      //
      // console.log('klciData >>>>>>>>>>>>>>', response);

      let price = this.klciData['values'].map(data => data.price);
      let alldates = this.klciData['values'].map(data => data.publishDate);

      let historyDates = [];
      alldates.forEach((res) => {
        let jsdate = new Date(res);
        historyDates.push(jsdate.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }));
      });

       // console.log('historyDates >>>>>>>>>>>>>>', historyDates);

       this.chart = new Chart('canvas', {
        type: 'line',
        data: {
          labels: historyDates,
          datasets: [
            {
              data: price,
              borderColor: '#91bd41',
              fill: false,
              label : 'Price '
            }
          ]
        },
        options: {
          elements: {
            line: {
                tension: 0
            }
            ,point: { radius: 2 }
          },
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true,
              ticks: {
                display: false
              },
              gridLines: {
                display : false
              }
            }],
            yAxes: [{
              display: true,
              ticks: {
                beginAtZero:true
              },
              gridLines: {
                display : true
              }
            }],
          }
        }
      });
    });
}
}
