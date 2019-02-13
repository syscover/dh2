import { Component, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { CoreDetailComponent } from '../../../core/structures/core-detail-compoment';
import { Package } from '../../admin/admin.models';
import { graphQL } from './version.graphql';

@Component({
    selector: 'dh2-update-version-detail',
    templateUrl: 'version-detail.component.html',
    animations: fuseAnimations
})
export class VersionDetailComponent extends CoreDetailComponent
{
    objectTranslation = 'UPDATE.VERSION';
    objectTranslationGender = 'F';
    packages: Package[] = [];

    constructor(
        private _injector: Injector
    ) {
        super(_injector, graphQL);
    }

    createForm(): void
    {
        this.fg = this.fb.group({
            id: [{value: '', disabled: true}],
            name: ['', Validators.required],
            package_id: ['', Validators.required],
            version: ['', Validators.required],
            publish: false
        });
    }

    setRelationsData(data: any): void
    {
        // admin packages
        this.packages = data.adminPackages;
    }
}