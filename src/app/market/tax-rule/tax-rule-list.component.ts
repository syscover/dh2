import { Component, Injector } from '@angular/core';
import { CoreListComponent } from './../../shared/super/core-list.component';
import { TaxRuleGraphQLService } from './tax-rule-graphql.service';

import * as _ from 'lodash';

@Component({
    selector: 'ps-tax-rule-list',
    templateUrl: './tax-rule-list.component.html'
})
export class TaxRuleListComponent extends CoreListComponent {

    // declare lodash to be used in view
    private _;

    // paramenters for parent class
    // columns where will be used for global searchs
    columnsSearch: string[] = [
        'tax_rate_zone.id', 'tax_rate_zone.name', 'tax_rate_zone.tax_rate'
    ];

    constructor(
        // service for parent class
        protected injector: Injector,
        protected graphQL: TaxRuleGraphQLService,
    ) {
        super(injector, graphQL);
        this._ = _;
    }
}
