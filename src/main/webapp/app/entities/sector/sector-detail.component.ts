import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';
import { DashboardService } from '../../../app/shared/stock/dashboard.service';
import { DateFormatPipe } from '../../home/date-format-pipe';
import { Sector, LatestNews } from './sector.model';
import { SectorService } from './sector.service';
import { Chart } from 'chart.js';

@Component({
    selector: 'jhi-sector-detail',
    templateUrl: './sector-detail.component.html'
})
export class SectorDetailComponent implements OnInit, OnDestroy {

    sectorPriceChart = [];
    sectorPercentageChart = [];
    startDate: any;
    endDate: any;
    today: any;
    oldDate: any;
    sectorPriceData: any = [];
    sectorPercentageData: any = [];
    sectorCode: any;
    sector: Sector;
    latestNewsData: LatestNews;
    hotTopicsData: any = [];
    companyAnnouncementData: any;
   list: any;
    dataList: any;
    companyList: any;
    mostDiscussedCompanyData: any = [];
    sectorInfoId: string;
    sectorName: string;
    SectorInfo: any = {};
    private subscription: Subscription;
    private eventSubscriber: Subscription;
    constructor(
        private eventManager: JhiEventManager,
        private sectorService: SectorService,
        private route: ActivatedRoute,
        private dashboardService: DashboardService
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
            this.sectorCode = params['id'];
        });

        this.registerChangeInSectors();
        // Date
        this.today = new Date();
        this.oldDate = new Date();
        this.oldDate.setDate(this.today.getDate() - 365);
        const dateFormatPipeFilter = new DateFormatPipe();
        this.startDate = dateFormatPipeFilter.transform(this.oldDate);
        this.endDate = dateFormatPipeFilter.transform(this.today);

        // Chart created by Ravi
        this.sectorPriceChartMethod(this.startDate, this.endDate, this.sectorCode);
        this.sectorPercentageChartMethod(this.startDate, this.endDate, this.sectorCode);
        // console.log('this.startDate >>>>>>>>>>>>>>', this.startDate);
        // console.log('this.endDate >>>>>>>>>>>>>>', this.endDate);
        // End Chart created by Ravi
    }

    load(id) {
        this.sectorService.find(id).toPromise().then((response) => {console.log('SECTOR DATA', response);
            this.sector = response.body;
            const {name} = this.sector;
            this.dashboardService.getLatestNews(name).toPromise().then((result) => {
                this.latestNewsData = result.body;
            });
            this.dashboardService.getCompanyAnnouncement(name).toPromise().then((result) => {
                this.companyAnnouncementData = result.body;
            });
            this.sectorService.getHotTopic(name).toPromise().then((result) => {
                this.list = result.body;
                for (let i = 0, len = this.list.length; i < len; i++) {
                    this.hotTopicsData.push({
                        topic: this.list[i].topic,
                        count: this.list[i].count,
                    });
                }
            });
            this.sectorService.getMostDiscussedCompany(name).toPromise().then((result) => {
                this.companyList = result.body;
                for (let i = 0, len = this.companyList.length; i < len; i++) {
                    this.mostDiscussedCompanyData.push({
                        topic: this.companyList[i].topic,
                        count: this.companyList[i].count,
                    });
                }
            });
            // console.log('this.mostDiscussedCompanyData', this.mostDiscussedCompanyData);
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInSectors() {
        this.eventSubscriber = this.eventManager.subscribe(
            'sectorListModification',
            (response) => this.load(this.sector.id)
        );
    }
  // Sector Price Chart Code Starts
    sectorPriceChartMethod(startDate, endDate, sectorCode) {

      this.dashboardService.getSectorPriceData(this.startDate, this.endDate, this.sectorCode).toPromise().then((response) => {

      this.sectorPriceData = response.body;
      // console.log(' ****this.sectorPriceData', response);

      // console.log('sectorPriceData >>>>>>>>>>>>>>', response);

        let price = this.sectorPriceData['values'].map(data => data.price);
        let alldates = this.sectorPriceData['values'].map(data => data.publishDate);

        let historyDates = [];
        alldates.forEach((res) => {
          let jsdate = new Date(res);
          historyDates.push(jsdate.toLocaleDateString('en', {year: 'numeric', month: 'short', day: 'numeric'}));
        });
        this.sectorPriceChart = new Chart('sectorPriceChartCanvas', {
          type: 'line',
          data: {
            labels: historyDates,
            datasets: [
              {
                data: price,
                borderColor: '#4eab79',
                fill: false,
                label: 'Price '
              }
            ]
          },
          options: {
            elements: {
              line: {
                tension: 0
              },
              point: { radius: 2 }
            },
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                display: true,
                ticks: {
                  display: true
                },
                gridLines: {
                  display: false
                }
              }],
              yAxes: [{
                display: true,
                ticks: {
                  beginAtZero: false
                },
                gridLines: {
                  display: true
                }
              }],
            },
            responsive : false,
            maintainAspectRatio : true
          }
        });
      });
    }

      // Sector Price Chart Code Ends

  // Sector % Chart Code Starts
   sectorPercentageChartMethod(startDate, endDate, sectorCode) {

      this.dashboardService.getSectorPercentageData(this.startDate, this.endDate, this.sectorCode).toPromise().then((response) => {

      this.sectorPercentageData = response.body;
      // console.log(' ****this.sectorPercentageData', response);

      // console.log('sectorPercentageData >>>>>>>>>>>>>>', response);

      let price = this.sectorPercentageData['values'].map(data => data.percentage);
      let alldates = this.sectorPercentageData['values'].map(data => data.publishDate);

      let historyDates = [];
      alldates.forEach((res) => {
        let jsdate = new Date(res);
        historyDates.push(jsdate.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }));
      });

       // console.log('historyDates >>>>>>>>>>>>>>', historyDates);

       this.sectorPercentageChart = new Chart('sectorPercentageChartCanvas', {
        type: 'line',
        data: {
          labels: historyDates,
          datasets: [
            {
              data: price,
              borderColor: '#e55c5c',
              fill: false,
              label : 'Price '
            }
          ]
        },
            options: {
            elements: {
              line: {
                tension: 0
              },
              point: { radius: 2 }
            },
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                display: true,
                ticks: {
                  display: true
                },
                gridLines: {
                  display: false
                }
              }],
              yAxes: [{
                display: true,
                ticks: {
                   display: true,
                beginAtZero: false,
                callback: function(value, index, values) {
                        return value + ' %';
                    }
                },
                gridLines: {
                  display: true
                }
              }],
            },
              tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              return tooltipItem.yLabel + ' %';
            }
          }
        },
            responsive : false,
            maintainAspectRatio : true
          }
        });
      });
    }

     // Sector % Chart Code Ends
}
