import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { CoreDetailComponent } from '@horus/foundations/core-detail-component';
import { Type } from './../innova-concrete.models';
import { graphQL } from './characteristic.graphql';
import { AttachmentFamily } from '../../admin/admin.models';

@Component({
    selector: 'dh2-innova-concrete-characteristic-detail',
    templateUrl: 'characteristic-detail.component.html',
    animations: fuseAnimations
})
export class CharacteristicDetailComponent extends CoreDetailComponent  implements OnInit
{
    public objectTranslation = 'INNOVA.CHARACTERISTIC';
    public objectTranslationGender = 'F';
    public types: Type[] = [];
    public attachmentFamilies: AttachmentFamily[] = [];

    constructor(
        protected injector: Injector
    )
    {
        super(injector, graphQL);
    }

    createForm(): void
    {
        this.fg = this.fb.group({
            id: [{value: '', disabled: true}],
            type_id: ['', Validators.required],
            name: ['', Validators.required],
            description: '',
            attachments: this.fb.array([])
        });
    }

    argumentsRelationsObject(): object
    {
        const sqlAttachmentFamily = [
            {
                'command': 'where',
                'column': 'admin_attachment_family.resource_id',
                'operator': '=',
                'value': 'innova-characteristic'
            },
            {
                'command': 'orderBy',
                'operator': 'asc',
                'column': 'admin_attachment_family.name'
            }
        ];

        return {
            sqlAttachmentFamily
        };
    }

    setRelationsData(data: any): void
    {
        // innova concrete types
        this.types = data.innovaConcreteTypes;

        // admin attachment families
        this.attachmentFamilies = data.adminAttachmentFamilies;
    }
}
