import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DataContainerComponent } from './../shared/components/data-container/data-container.component';
import { ErrorComponent } from './../shared/components/errors/error.component';

import { AuthGuard } from './../core/auth/auth-guard.service';

import { CustomerListComponent } from './customer/customer-list.component';
import { GroupListComponent } from './group/group-list.component';
import { GroupDetailComponent } from './group/group-detail.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        children: [
            {
                path: '',                                       component: DataContainerComponent,
                canActivateChild: [AuthGuard],
                children: [

                    // Customers
                    { path: 'customer',                         component: CustomerListComponent },

                    // Groups
                    { path: 'group',                            component: GroupListComponent },
                    { path: 'group/create',                     component: GroupDetailComponent,       data: { action: 'create' }},
                    { path: 'group/show/:id',                   component: GroupDetailComponent,       data: { action: 'edit' }},

                    // Wildcard route
                    { path: '**',                               component: ErrorComponent,             data: { error: '404' }}
                ]
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class CrmRoutingModule {}
