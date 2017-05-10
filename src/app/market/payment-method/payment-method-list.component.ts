import { Component, Injector, HostBinding } from '@angular/core';
import { LazyLoadEvent, DataTable, ConfirmationService } from 'primeng/primeng';

import { CoreListComponent } from './../../shared/super/core-list.component';

import { PaymentMethodService } from './payment-method.service';
import { PaymentMethod } from './../market.models';
import { LangService } from './../../admin/lang/lang.service';
import { Lang } from './../../admin/admin.models';

@Component({
    selector: 'ps-payment-method-list',
    templateUrl: './payment-method-list.component.html'
})
export class PaymentMethodListComponent extends CoreListComponent {

    // paramenters for parent class
    // columns where will be used for global searchs
    columnsSearch: string[] = [
        'payment_method.id', 'payment_method.name'
    ];
    objects: PaymentMethod[] = []; // initializes the component to has any data for view
    f: Function = data => this.objects = data; // function to set custom data

    constructor(
        protected langService: LangService,

        // service for parent class
        protected injector: Injector,
        protected objectService: PaymentMethodService,
    ) {
        super(injector);
    }
}
