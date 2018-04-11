import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { SERVER_API_URL } from '../../app.constants';

import { Stock } from './stock.model';
import { createRequestOption } from '../../shared';

export type EntityResponseType = HttpResponse<Stock>;

@Injectable()
export class StockService {

    private resourceUrl =  SERVER_API_URL + 'stockservices/api/stocks';

    constructor(private http: HttpClient) { }

    create(stock: Stock): Observable<HttpResponse<any>> {
        const copy = this.convert(stock);
        return this.http.post<Stock>(this.resourceUrl, copy, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }
    update(stock: Stock): Observable<HttpResponse<any>> {
        const copy = this.convert(stock);
        return this.http.put<Stock>(this.resourceUrl, copy, { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    find(id: number): Observable<HttpResponse<any>> {
        return this.http.get<Stock>(`${this.resourceUrl}/stock-infos/${id}`, { observe: 'response'})
        // return this.http.get<Stock>(SERVER_API_URL + 'stockservices/api/stocks/17/stock-prices/daily-summary?publishDate=2018-03-28', { observe: 'response'})
            .map((res: EntityResponseType) => this.convertResponse(res));
    }

    query(req?: any): Observable<HttpResponse<any>> {
        const options = createRequestOption(req);
        return this.http.get<Stock[]>(this.resourceUrl, { params: options, observe: 'response'})
            .map((res: HttpResponse<Stock[]>) => this.convertArrayResponse(res));
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response'});
    }
    getStockInfos(stockInfoId: any, date: any): Observable<HttpResponse<any>> {
    return this.http.get<any>(SERVER_API_URL + 'stockservices/api/stocks/' + stockInfoId + '/stock-prices/daily-summary?publishDate=' + date, { observe: 'response' });
}
    getLatestNews(name: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(SERVER_API_URL + 'sentimentservices/api/getLatestNewsByStockName/' + name, { observe: 'response' });
    }
    getHotTopic(name: any): Observable<HttpResponse<any>> {
        return this.http.get<any>(SERVER_API_URL + 'sentimentservices/api/getHotTopicsByStockName/' + name, { observe: 'response' });
    }
    getCompanyAnnouncement(name: string): Observable<HttpResponse<any>> {
        return this.http.get<any>(SERVER_API_URL + 'sentimentservices/api/getCompanyAnnouncementByStockName/' + name, { observe: 'response' });
    }

    private convertResponse(res: EntityResponseType): EntityResponseType {
        const body: Stock = this.convertItemFromServer(res.body);
        return res.clone({body});
    }

    private convertArrayResponse(res: HttpResponse<Stock[]>): HttpResponse<Stock[]> {
        const jsonResponse: Stock[] = res.body;
        const body: Stock[] = [];
        for (let i = 0; i < jsonResponse.length; i++) {
            body.push(this.convertItemFromServer(jsonResponse[i]));
        }
        return res.clone({body});
    }

    /**
     * Convert a returned JSON object to stock.
     */
    private convertItemFromServer(stock: Stock): Stock {
        const copy: Stock = Object.assign({}, stock);
        return copy;
    }

    /**
     * Convert a stock to a JSON which can be sent to the server.
     */
    private convert(stock: Stock): Stock {
        const copy: Stock = Object.assign({}, stock);
        return copy;
    }
}
