import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorizationService } from '@horus/services/authorization.service';

import { ActionDetailComponent } from './action/action-detail.component';
import { ActionListComponent } from './action/action-list.component';
import { CategoryDetailComponent } from './category/category-detail.component';
import { CategoryListComponent } from './category/category-list.component';
import { EmploymentOfficeListComponent } from './employment-office/employment-office-list.component';
import { EmploymentOfficeDetailComponent } from './employment-office/employment-office-detail.component';
import { ExpedientDetailComponent } from './expedient/expedient-detail.component';
import { ExpedientListComponent } from './expedient/expedient-list.component';
import { GroupDetailComponent } from './group/group-detail.component';
import { GroupListComponent } from './group/group-list.component';
import { GroupHistoryListComponent } from './group/group-history-list.component';
import { InscriptionDetailComponent } from './inscription/inscription-detail.component';
import { InscriptionListComponent } from './inscription/inscription-list.component';
import { LocalityDetailComponent } from './locality/locality-detail.component';
import { LocalityListComponent } from './locality/locality-list.component';
import { ProfileDetailComponent } from './profile/profile-detail.component';
import { ProfileListComponent } from './profile/profile-list.component';
import { ProvinceDetailComponent } from './province/province-detail.component';
import { ProvinceListComponent } from './province/province-list.component';
import { TrainerDetailComponent } from './trainer/trainer-detail.component';
import { TrainerListComponent } from './trainer/trainer-list.component';
import { MatriculateDetailComponent } from './matriculate/matriculate-detail.component';
 

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthorizationService],
        children: [
            // Actions
            { path: 'action',                                               component: ActionListComponent,                     data: { action: 'list', resource: 'forem-action' }},
            { path: 'action/create',                                        component: ActionDetailComponent,                   data: { action: 'create', resource: 'forem-action' }},
            { path: 'action/show/:id',                                      component: ActionDetailComponent,                   data: { action: 'edit', resource: 'forem-action' }},

            // Categories
            { path: 'category',                                             component: CategoryListComponent,                   data: { action: 'list', resource: 'forem-category' }},
            { path: 'category/create',                                      component: CategoryDetailComponent,                 data: { action: 'create', resource: 'forem-category' }},
            { path: 'category/show/:id',                                    component: CategoryDetailComponent,                 data: { action: 'edit', resource: 'forem-category' }},

            // EmploymentOffices
            { path: 'employment-office',                                    component: EmploymentOfficeListComponent,           data: { action: 'list', resource: 'forem-employment-office' }},
            { path: 'employment-office/create',                             component: EmploymentOfficeDetailComponent,         data: { action: 'create', resource: 'forem-employment-office' }},
            { path: 'employment-office/show/:id',                           component: EmploymentOfficeDetailComponent,         data: { action: 'edit', resource: 'forem-employment-office' }},

            // Expedients
            { path: 'expedient',                                            component: ExpedientListComponent,                  data: { action: 'list', resource: 'forem-expedient' }},
            { path: 'expedient/create',                                     component: ExpedientDetailComponent,                data: { action: 'create', resource: 'forem-expedient' }},
            { path: 'expedient/show/:id',                                   component: ExpedientDetailComponent,                data: { action: 'edit', resource: 'forem-expedient' }},

            // Groups
            { path: 'group',                                                component: GroupListComponent,                      data: { action: 'list', resource: 'forem-group' }},
            { path: 'group/create',                                         component: GroupDetailComponent,                    data: { action: 'create', resource: 'forem-group' }},
            { path: 'group/show/:id',                                       component: GroupDetailComponent,                    data: { action: 'edit', resource: 'forem-group' }},
            
            // History Groups
            { path: 'history-group',                                        component: GroupHistoryListComponent,               data: { action: 'list', resource: 'forem-group' }},
            { path: 'history-group/show/:id',                               component: GroupDetailComponent,                    data: { action: 'edit', resource: 'forem-group' }},

            // Courses
            { path: 'group/show/:group_id/edit/:id',                        component: MatriculateDetailComponent,              data: { action: 'edit', resource: 'forem-group' }},

            // Groups office
            { path: 'group-office',                                         component: GroupListComponent,                      data: { action: 'list', resource: 'forem-group-office' }},
            { path: 'group-office/create',                                  component: GroupDetailComponent,                    data: { action: 'create', resource: 'forem-group-office' }},
            { path: 'group-office/show/:id',                                component: GroupDetailComponent,                    data: { action: 'edit', resource: 'forem-group-office' }},

            // Inscriptions
            { path: 'inscription',                                          component: InscriptionListComponent,                data: { action: 'list', resource: 'forem-inscription' }},
            { path: 'inscription/create',                                   component: InscriptionDetailComponent,              data: { action: 'create', resource: 'forem-inscription' }},
            { path: 'inscription/show/:id',                                 component: InscriptionDetailComponent,              data: { action: 'edit', resource: 'forem-inscription' }},

            // Inscriptions office
            { path: 'inscription-office',                                   component: InscriptionListComponent,                data: { action: 'list', resource: 'forem-inscription-office' }},
            { path: 'inscription-office/create',                            component: InscriptionDetailComponent,              data: { action: 'create', resource: 'forem-inscription-office' }},
            { path: 'inscription-office/show/:id',                          component: InscriptionDetailComponent,              data: { action: 'edit', resource: 'forem-inscription-office' }},

            // Localities
            { path: 'locality',                                             component: LocalityListComponent,                   data: { action: 'list', resource: 'forem-locality' }},
            { path: 'locality/create',                                      component: LocalityDetailComponent,                 data: { action: 'create', resource: 'forem-locality' }},
            { path: 'locality/show/:id',                                    component: LocalityDetailComponent,                 data: { action: 'edit', resource: 'forem-locality' }},

            // Profile
            { path: 'profile',                                              component: ProfileListComponent,                    data: { action: 'list', resource: 'forem-profile' }},
            { path: 'profile/create',                                       component: ProfileDetailComponent,                  data: { action: 'create', resource: 'forem-profile' }},
            { path: 'profile/show/:id',                                     component: ProfileDetailComponent,                  data: { action: 'edit', resource: 'forem-profile' }},

            // Provinces
            { path: 'province',                                             component: ProvinceListComponent,                   data: { action: 'list', resource: 'forem-province' }},
            { path: 'province/create',                                      component: ProvinceDetailComponent,                 data: { action: 'create', resource: 'forem-province' }},
            { path: 'province/show/:id',                                    component: ProvinceDetailComponent,                 data: { action: 'edit', resource: 'forem-province' }},

            // Trainers
            { path: 'trainer',                                              component: TrainerListComponent,                    data: { action: 'list', resource: 'forem-trainer' }},
            { path: 'trainer/create',                                       component: TrainerDetailComponent,                  data: { action: 'create', resource: 'forem-trainer' }},
            { path: 'trainer/show/:id',                                     component: TrainerDetailComponent,                  data: { action: 'edit', resource: 'forem-trainer' }},
        ]  
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class ForemRoutingModule {}
