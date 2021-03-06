import { Component, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { CoreDetailComponent } from '@horus/foundations/core-detail-component';
import { OrderStatus } from '../market.models';
import { graphQL } from './payment-method.graphql';

@Component({
    selector: 'dh2-market-payment-method-detail',
    templateUrl: './payment-method-detail.component.html',
    animations: fuseAnimations
})
export class PaymentMethodDetailComponent extends CoreDetailComponent
{
    objectTranslation = 'MARKET.PAYMENT_METHOD';
    objectTranslationGender = 'F';
    orderStatuses: OrderStatus[] = [];

    constructor(
        protected injector: Injector
    ) {
        super(injector, graphQL);
    }

    createForm(): void
    {
        this.fg = this.fb.group({
            ix: '',
            id: [{value: '', disabled: true}, Validators.required],
            lang_id: ['', Validators.required],
            order_status_successful_id: ['', Validators.required],
            name: ['', Validators.required],
            minimum_price: '',
            maximum_price: '',
            sort: '',
            active: false,
            instructions: ''
        });
    }

    argumentsRelationsObject(): object
    {
        const sqlOrderStatus = [
            {
                command: 'where',
                column: 'lang_id',
                operator: '=',
                value: this.params['lang_id'] ? this.params['lang_id'] : this.baseLang.id
            },
            {
                command: 'orderBy',
                operator: 'asc',
                column: 'name'
            }
        ];

        return {
            sqlOrderStatus
        };
    }

    setRelationsData(data: any)
    {
        // set order statuses
        this.orderStatuses = data.marketOrderStatuses;
    }
}
