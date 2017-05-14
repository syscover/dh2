import { Injector } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { JsonResponse } from './../classes/json-respose';

import * as appGlobals from './../../core/app-globals';
import * as _ from 'lodash';

export class CoreService {

    protected headers: Headers;
    protected options: RequestOptions;
    protected http: Http;
    protected appRootPrefix: string = appGlobals.appRootPrefix;
    protected apiUrlPrefix: string = appGlobals.apiUrlPrefix;
    private _baseUri: string;

    constructor(
        protected injector: Injector
    ) {
        this.http = injector.get(Http);

        this.headers = new Headers({ 'Content-Type': 'application/json' });
        this.options = new RequestOptions({ headers: this.headers });
    }

    searchRecords(object: any, params: Params = undefined): Observable<JsonResponse> {
        return this.http
            .post(this.getApiUrl('search', params), object, this.options)
            .map((response: Response) => response.json());
    }

    getRecords(params: Params = undefined): Observable<JsonResponse> {
        return this.http
            .get(this.getApiUrl('get', params), this.apiUrlPrefix)
            .map((response: Response) => response.json());
    }

    getRecord(params: Params): Observable<JsonResponse> {
        return this.http
            .get(this.getApiUrl('find', params))
            .map((response: Response) => response.json());
    }

    storeRecord(object: any, params: Params = undefined) {
        return this.http
            .post(this.getApiUrl('store', params), object, this.options)
            .map(response => response.json());
    }

    updateRecord(object: any, params: Params) {
        return this.http
            .put(this.getApiUrl('update', params), object, this.options)
            .map(response => response.json());
    }

    deleteRecord(params: Params) {
        return this.http
            .delete(this.getApiUrl('delete', params))
            .map(response => response.json());
    }

    protected setBaseUri(baseUri: string) {
        this._baseUri = baseUri; // set base uri
    }

    get baseUri(): string {
        return this._baseUri; // get base uri
    }

    protected setApiUrl(urlAddons: string) {
        this.apiUrlPrefix = this.apiUrlPrefix + urlAddons; // set api URL
    }

    protected getApiUrl(action: string, params: Params = undefined) {

        let urlParams = '';
        /**
         * If you have any parameters the url is composed 
         * according to the order of parameters
         */
        if (params !== undefined) {
            urlParams = '/' + _.values(params).join('/');
        }

        if (action === 'search') {
            return `${this.apiUrlPrefix}/search${urlParams}`;
        }

        /**
         * For actions get, find, store, update and delete
        */
        return `${this.apiUrlPrefix}${urlParams}`;
    }
}
