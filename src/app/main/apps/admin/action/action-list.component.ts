import { Component, Injector } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CoreListComponent } from '@horus/foundations/core-list-component';
import { graphQL } from './action.graphql';

/**
 * Inherited properties
 *
 * env: any;
 * configService: ConfigService;
 * graphQLUrl: string;
 * restUrl: string;
 *
 *
 *
 */
@Component({
    selector: 'dh2-admin-action-list',
    templateUrl: './action-list.component.html',
    animations : fuseAnimations,
    styleUrls: ['../../../../scss/improvements/core-list-component.scss']
})
export class ActionListComponent extends CoreListComponent
{
    objectTranslation = 'ADMIN.ACTION';
    objectTranslationGender = 'F';
    columnsSearch: string[] = ['admin_action.id', 'admin_action.name'];
    displayedColumns = ['admin_action.id', 'admin_action.name', 'actions'];

    constructor(
        protected injector: Injector
    ) {
        super(injector, graphQL);
    }
}
