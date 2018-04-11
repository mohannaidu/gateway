import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';
import { Sector } from '../index';
import 'rxjs/add/operator/map';
import { Stock } from '../index';
import { LatestNews } from '../../entities/sector/sector.model';

@Injectable()
export class DashboardService {
    constructor(private http: HttpClient) { }

    get(publishDate: string): Observable<HttpResponse<Sector>> {
        return this.http.get<Sector>(SERVER_API_URL + 'stockservices/api/sectors/daily-summary?publishDate=' + publishDate, { observe: 'response' });
    }

    getBySector(id: number): Observable<HttpResponse<any>> {
        return this.http.get<any>(SERVER_API_URL + 'stockservices/api/stock-prices/getbysector/:id', { observe: 'response' });
    }

    getTopStock(publishDate: string): Observable<HttpResponse<any>> {
        return this.http.get<Stock>(SERVER_API_URL + 'stockservices/api/stocks/stock-prices/top-active?publishDate=' + publishDate, { observe: 'response' });
    }

    getLatestNews(name: string): Observable<HttpResponse<LatestNews>> {
        return this.http.get<LatestNews>(SERVER_API_URL + 'sentimentservices/api/getLatestNewsBySector/' + name, { observe: 'response' });
    }
    
    getCompanyAnnouncement(name: string): Observable<HttpResponse<LatestNews>> {
        return this.http.get<LatestNews>(SERVER_API_URL + 'sentimentservices/api/getCompanyAnnouncementBySector/' + name, { observe: 'response' });
    }

    getPortfolio(name: string, publishDate: string): Observable<HttpResponse<any>> {
        return this.http.get<Sector>(SERVER_API_URL + 'stockservices/api/users/user-portfolios/stocks?username=' + name + '&publishDate=' + publishDate, { observe: 'response' });
    }
    getTotalArticle(name: string): Observable<HttpResponse<any>> {
        return this.http.get<Sector>(SERVER_API_URL + 'sentimentservices/api/getTotalArticleBySector/' + name , { observe: 'response' });
    }

    // ********** Sample Data JSONs for Charts
    // return this.http.get('http://mysafeinfo.com/api/data?list=englishmonarchs&format=json');
    // return this.http.get('http://samples.openweathermap.org/data/2.5/history/city?q=Warren,OH&appid=b6907d289e10d714a6e88b30761fae22');
    // return this.http.get('https://api.myjson.com/bins/y3vdz');
    // return this.http.get('https://api.myjson.com/bins/qbb2v');
    // return this.http.get('https://api.myjson.com/bins/p3mjr');
    // return this.http.get('https://api.myjson.com/bins/p3mjr');
    // Actual Rest API from Code
    // http://10.4.130.8:8080/stockservices/api/indices/indice-prices/history?indiceSymbol=FBMKLCI&startDate=2017-03-28&endDate=2018-03-30
    // Sector % Date Json
    // return this.http.get('https://api.myjson.com/bins/waztf',
    // Stock 3 entities data
    // https://api.myjson.com/bins/l49cz

    getKlciIndexData(startDate: string, endDate: string): Observable<HttpResponse<any>> {
    // http://10.4.130.8:8080/stockservices/api/indices/indiceInfoId}/indice-prices/history?startDate= yyyy-mm-dd &endDate= yyyy-mm-dd
      return this.http.get(SERVER_API_URL + '/stockservices/api/indices/indice-prices/history?indiceSymbol=FBMKLCI&startDate='+ startDate +'&endDate=' + endDate,
      { observe: 'response' });
    }

     getSectorPriceData(startDate: string, endDate: string, sectorCode: string): Observable<HttpResponse<any>> {
     // http://10.4.130.8:8082/api/sectors/5/price/history?publishDate=2018-04-04&duration=12
      // return this.http.get('https://api.myjson.com/bins/p3mjr',
      return this.http.get(SERVER_API_URL + '/stockservices/api/sectors/'+ sectorCode +'/price/history?publishDate='+ endDate +'&duration=12', 
      { observe: 'response' });
    }

    getSectorPercentageData(startDate: string, endDate: string, sectorCode: string): Observable<HttpResponse<any>> {
//      http://10.4.130.8:8082/api/sectors/5/percentage/history?publishDate=2018-04-04&duration=12
       // return this.http.get('https://api.myjson.com/bins/waztf',
     return this.http.get(SERVER_API_URL + '/stockservices/api/sectors/'+ sectorCode +'/percentage/history?publishDate='+ endDate +'&duration=12', 
      { observe: 'response' });
    }

    getStockViewChartData(startDate: string, endDate: string, stockId: string): Observable<HttpResponse<any>> {
//      http://10.4.130.8:8082/api/stocks/3207/stock-prices/history?publishDate=2018-04-04&duration=12
//     return this.http.get('https://api.myjson.com/bins/l49cz',
    return this.http.get(SERVER_API_URL + '/stockservices/api/stocks/'+ stockId +'/stock-prices/history?publishDate=' + endDate + '&duration=12', 
      { observe: 'response' });
    }

    getIndiceInfo(): Observable<any> {
     return this.http.get(SERVER_API_URL + '/stockservices/api/indices/indice-prices/history?indiceSymbol=FBMKLCI&startDate=2010-12-28&endDate=2018-03-30');
    }

    // save(account: any): Observable<HttspResponse<any>> {
    //     return this.http.post(SERVER_API_URL + 'api/account', account, { observe: 'response' });
    // }
}
