import { NgModule } from '@angular/core';
import { SharedModule as FuseShareModule } from './../../../../core/modules/shared.module';
import { SharedModule } from './../../core/modules/shared.module';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from './../../../../core/services/translation-loader.service';
import { locale as english } from './i18n/en';
import { locale as spanish } from './i18n/es';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
    imports: [
        FuseShareModule,
        SharedModule,
        DashboardRoutingModule
    ],
    exports: [ ],
    declarations: [
        DashboardComponent
    ],
    providers: [
        
    ]
})

export class DashboardModule 
{
    constructor(
        private translate: TranslateService,
        private translationLoader: FuseTranslationLoaderService
    ){
        this.translationLoader.loadTranslations(english, spanish);
    }
}
