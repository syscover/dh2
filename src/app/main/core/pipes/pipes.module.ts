import { NgModule } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActionTranslationObjectPipe } from './action-trasnlation-object.pipe';
import { CheckTranslationObjectPipe } from './check-translation-object.pipe';
import { CurrencyFormatPipe } from './currency-format.pipe';
import { GetCollectionObjectValuePipe } from './get-collection-object-value.pipe';
import { SizeFormatPipe } from './size-format.pipe';
import { NumbersArrayPipe } from './numbers-array.pipe';
import { SortByPipe } from './sort-by.pipe';
import { ValuesArrayPipe } from './values-array.pipe';

@NgModule({
    providers: [
        DecimalPipe
    ],
    declarations: [
        ActionTranslationObjectPipe,
        CheckTranslationObjectPipe,
        CurrencyFormatPipe,
        GetCollectionObjectValuePipe,
        SizeFormatPipe,
        NumbersArrayPipe,
        SortByPipe,
        ValuesArrayPipe
    ],
    imports     : [],
    exports     : [
        ActionTranslationObjectPipe,
        CheckTranslationObjectPipe,
        CurrencyFormatPipe,
        GetCollectionObjectValuePipe,
        SizeFormatPipe,
        NumbersArrayPipe,
        SortByPipe,
        ValuesArrayPipe
    ]
})
export class PipesModule
{
}