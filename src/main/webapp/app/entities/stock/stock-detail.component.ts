import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs/Subscription';
import { JhiEventManager } from 'ng-jhipster';
import { DashboardService } from '../../../app/shared/stock/dashboard.service';
import { Stock, LatestNews } from './stock.model';
import { StockService } from './stock.service';
import { DatePipe } from '@angular/common';
import { DateFormatPipe } from './date-format-pipe';
import { Chart } from 'chart.js';

@Component({
  selector: 'jhi-stock-detail',
  templateUrl: './stock-detail.component.html',
  styles: []
})
export class StockDetailComponent implements OnInit, OnDestroy {
    stockViewPriceChart = [];
    stockViewVolumeChart = [];v
    stockViewPercentageChart = [];
    startDate: any;
    endDate: any;
    today: any;
    oldDate: any;
    stockViewData: any = [];
    stockId: any;
    companyAnnouncementData: any;
    @Input() stock: any;
    // stock: Stock;
    latestNewsData: LatestNews;
    list: any;
    hotTopicsData: any = [];
    stockInfosData: any;
    private subscription: Subscription;
    private eventSubscriber: Subscription;
    stockName: string;

    constructor(
        private eventManager: JhiEventManager,
        private stockService: StockService,
        private route: ActivatedRoute,
        private dashboardService: DashboardService,
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
         this.load(params['id']);
         this.stockId = params['id'];
        });
        console.log('stockId');
        console.log(this.stockId);

        this.today = new Date();
        this.oldDate = new Date();

        this.oldDate.setDate(this.today.getDate() - 365);

        const dateFormatPipeFilter = new DateFormatPipe();
        this.startDate = dateFormatPipeFilter.transform(this.oldDate);
        this.endDate = dateFormatPipeFilter.transform(this.today);

        console.log('this.startDate >>>>>>>>>>>>>>', this.startDate);
        console.log('this.endDate >>>>>>>>>>>>>>', this.endDate);
        console.log('this.sectorCode >>>>>>>>>>>>>>', this.stockId);

        this.registerChangeInSectors();
        this.stockViewPriceChartData(this.startDate, this.endDate, this.stockId);
        this.stockViewVolumeChartData(this.startDate, this.endDate, this.stockId);
        this.stockViewPercentageChartData(this.startDate, this.endDate, this.stockId);
    }
    load(id) {
        this.stockService.find(id).toPromise().then((response) => {console.log('this.stock  *********',  response);
            this.stock = response.body;
            const {name} = this.stock;
            const {code} = this.stock;
            this.stockService.getStockInfos(this.stockId, '2018-03-28').toPromise().then((result) => {
                this.stockInfosData = result.body;
                // console.log('stockInfosData', this.stockInfosData);
            });
            this.stockService.getLatestNews(name).toPromise().then((result) =>
                this.latestNewsData = result.body
            );
            this.stockService.getCompanyAnnouncement(name).toPromise().then((result) => {
                this.companyAnnouncementData = result.body;
                // console.log(' companyAnnouncementData',  this. companyAnnouncementData);
            });
            this.stockService.getHotTopic(name).toPromise().then((result) => { console.log('result *********',  result);
                this.list = result.body;
                for (let i = 0, len = this.list.length; i < len; i++) {
                    this.hotTopicsData.push({
                        topic: this.list[i].topic,
                        count: this.list[i].count,
                    });
                }
            });  console.log('this.hotTopicsData', this.hotTopicsData);
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
            (response) => this.load(this.stock.id)
        );
    }

     stockViewPriceChartData(startDate, endDate, stockId) {

      this.dashboardService.getStockViewChartData(this.startDate, this.endDate, this.stockId).toPromise().then((response) => {

      this.stockViewData = response.body;
      console.log(' ****this.stockViewData', response);

      console.log('stockViewPriceData >>>>>>>>>>>>>>', response);

      let price = this.stockViewData['values'].map(data => data.main.price);
      let alldates = this.stockViewData['values'].map(data => data.main.publishDate);

      let historyDates = [];
      alldates.forEach((res) => {
        let jsdate = new Date(res);
        historyDates.push(jsdate.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }));
      });

       console.log('historyDates >>>>>>>>>>>>>>', historyDates);

       this.stockViewPriceChart = new Chart('stockViewPriceChartCanvas', {
        type: 'line',
        data: {
          labels: historyDates,
          datasets: [
            {
              data: price,
              borderColor: '#336699',
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
            display: false,
            position: 'bottom'
          },
          scales: {
            xAxes: [{
              callback: function(value) {
                return new Date(value).toLocaleDateString('de-DE', {month:'short', year:'numeric'});
              },
              display: true,
              ticks: {
                display: true
              },
              gridLines: {
                display : false
              }
            }],
            yAxes: [{
              display: true,
              ticks: {
                beginAtZero: false
              },
              gridLines: {
                display : true
              }
            }],
            responsive : false,
            maintainAspectRatio : true
          }
        }
      });
    });
}

stockViewVolumeChartData(startDate, endDate, stockId) {

  this.dashboardService.getStockViewChartData(this.startDate, this.endDate, this.stockId).toPromise().then((response) => {

  this.stockViewData = response.body;
  console.log(' ****this.stockViewData', response);

  console.log('stockViewVolumeData >>>>>>>>>>>>>>', response);

  let volume = this.stockViewData['values'].map(data => data.main.volume);
  let alldates = this.stockViewData['values'].map(data => data.main.publishDate);

  let historyDates = [];
  alldates.forEach((res) => {
    let jsdate = new Date(res);
    historyDates.push(jsdate.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }));
  });

   console.log('historyDates >>>>>>>>>>>>>>', historyDates);

   this.stockViewVolumeChart = new Chart('stockViewVolumeChartCanvas', {
    type: 'bar',
    data: {
      labels: historyDates,
      datasets: [
        {
          data: volume,
          borderColor: '#91bd41',
          fill: true,
          backgroundColor: 
            '#d48b1e'
          ,
          label : 'Volume '
        }]
    },
    options: {
      elements: {
        line: {
            tension: 0
        }
        ,point: { radius: 2 }
      },
      legend: {
        display: false,
        position: 'bottom'
      },
      scales: {
        xAxes: [{
          display: true,
          ticks: {
            display: true
          },
          gridLines: {
            display : false
          }
        }],
        yAxes: [{
          display: true,
          ticks: {
            beginAtZero: false
          },
          gridLines: {
            display : true
          }
        }],
        responsive : false,
        maintainAspectRatio : true
      }
    }
  });
});
}

stockViewPercentageChartData(startDate, endDate, stockId) {

  this.dashboardService.getStockViewChartData(this.startDate, this.endDate, this.stockId).toPromise().then((response) => {

  this.stockViewData = response.body;
  console.log(' ****this.stockViewData', response);

  console.log('stockViewPercentageData >>>>>>>>>>>>>>', response);

  let percentage = this.stockViewData['values'].map(data => data.main.percentage);
  let alldates = this.stockViewData['values'].map(data => data.main.publishDate);

  let historyDates = [];
  alldates.forEach((res) => {
    let jsdate = new Date(res);
    historyDates.push(jsdate.toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }));
  });

   console.log('historyDates >>>>>>>>>>>>>>', historyDates);

   this.stockViewPercentageChart = new Chart('stockViewPercentageChartCanvas', {
    type: 'line',
    data: {
      labels: historyDates,
      datasets: [
         {
          data: percentage,
          borderColor: '#ff0000',
          fill: false,
          label : 'Percentage '
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
        display: false,
        position: 'bottom'
      },
      scales: {
        xAxes: [{
          display: true,
          ticks: {
            display: true
          },
          gridLines: {
            display : false
          }
        }],
        yAxes: [{
          display: true,
          ticks: {
            beginAtZero: false
          },
          gridLines: {
            display : true
          }
        }],
        responsive : false,
        maintainAspectRatio : true
      }
    }
  });
});
}

}
