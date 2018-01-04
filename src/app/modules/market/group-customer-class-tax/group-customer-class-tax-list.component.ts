import { Component, Injector } from '@angular/core';
import { CoreListComponent } from './../../../core/super/core-list.component';
import { GroupCustomerClassTaxGraphQLService } from './group-customer-class-tax-graphql.service';

@Component({
    selector: 'app-group-customer-class-tax-list',
    templateUrl: './group-customer-class-tax-list.component.html'
})
export class GroupCustomerClassTaxListComponent extends CoreListComponent {

    // paramenters for parent class
    // columns where will be used for global searchs
    columnsSearch: string[] = [
        'crm_group.name', 'market_customer_class_tax.name'
    ];

    constructor(
        protected injector: Injector,
        protected graphQL: GroupCustomerClassTaxGraphQLService
    ) {
        super(injector, graphQL);
    }

    getCustomArgumentsDeleteRecord(object: any, args: Object): Object {
        return {
            'group_id': object.group_id,
            'customer_class_tax_id': object.customer_class_tax_id
        };
    }
}