import { Lang } from './../../admin/admin.models';
import { ViewChild } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/primeng';

import { CoreService } from './core.service';

export class CoreListComponent {

    public router: Router;
    public route: ActivatedRoute;
    protected totalRecords: number;     // total records in datatable
    protected filteredRecords: number;     // filtered records over total
    protected columnsSearch: string[];  // columns where will be used for global searchs

    constructor(
        private parentService: CoreService
    ) { }

    getRecords(f: Function): void {
        this.parentService
            .getRecords()
            .subscribe((response: any) => {
                f(response.data);
            });
    }

    /**
     * loadDadaTableLazy method
     *
     * @param event
     * @param f
     * @param lang      if need all results must be filtered by lang
     */
    loadDadaTableLazy(event: LazyLoadEvent, f: Function, lang: string = undefined) {

        let parameters: Object[] = [
            {
                'command': 'limit',
                'value': event.rows
            },
            {
                'command': 'offset',
                'value': event.first
            }
        ];

        // set commands to orderBy
        if (event.sortField) {
            parameters.push({
                    'command': 'orderBy',
                    'operator': event.sortOrder === 1 ? 'asc' : 'desc', // asc | desc
                    'column': event.sortField
                });
        }

        // set commands to filter
        if (event.globalFilter) {
            for (const column of this.columnsSearch) {
                parameters.push({
                    'command': 'orWhere',
                    'column': column,
                    'operator': 'like',
                    'value': `%${event.globalFilter}%`
                });
            }
        }

        const object = {
            'type': 'query',
            'lang': lang,
            'parameters': parameters
        };

        this.parentService
            .searchRecords(object)
            .subscribe((response) => {
                this.totalRecords = response.total;
                this.filteredRecords = response.filtered;
                f(response.data);
            });
    }

    deleteRecord(f: Function, object: any): void {

        let lang: string;

        if (object.lang_id) {   // check if has languages
            lang = object.lang_id;
        }

        this.parentService
            .deleteRecord(object.id, lang)
            .subscribe((response) => {
                this.getRecords(f);
            });
    }

}
