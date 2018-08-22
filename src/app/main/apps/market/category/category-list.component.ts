import { Component, Injector } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CoreListComponent } from './../../../core/structures/core-list-component';
import { CategoryGraphQLService } from './category-graphql.service';

@Component({
    selector: 'dh2-category-list',
    templateUrl: './category-list.component.html',
    animations : fuseAnimations,
    styleUrls: ['./../../../core/scss/improvements/core-list-component.scss']
})
export class CategoryListComponent extends CoreListComponent
{
    objectTranslation = 'MARKET.CATEGORY';
    objectTranslationGender = 'F';
    columnsSearch: string[] = ['market_category.id', 'market_category.name'];
    displayedColumns = ['market_category.id', 'market_category.name', 'market_category.active', 'translations', 'actions'];
    filters = [{'command': 'where', 'column': 'lang_id', 'operator': '=', 'value': this.baseLang }];

    constructor(
        protected injector: Injector,
        protected graphQL: CategoryGraphQLService
    ) {
        super(injector, graphQL);
    }
}