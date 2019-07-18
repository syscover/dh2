import { Component, Injector, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { CoreDetailComponent } from '@horus/foundations/core-detail-compoment';
import { Profile, Gender } from '../forem.models';
import { graphQL } from './trainer.graphql';

@Component({
    selector: 'dh2-forem-trainer-detail',
    templateUrl: 'trainer-detail.component.html',
    animations: fuseAnimations
})
export class TrainerDetailComponent extends CoreDetailComponent  implements OnInit
{
    objectTranslation = 'FOREM.TRAINER';
    objectTranslationGender = 'M';
    profiles: Profile[] = [];
    genders: Gender[] = [];

    constructor(
        protected injector: Injector
    ) {
        super(injector, graphQL);
    }

    createForm(): void
    {
        this.fg = this.fb.group({
            id: [{value: '', disabled: true}],
            profile_id: ['', Validators.required],
            name: ['', Validators.required],
            surname: '',
            surname2: '',
            gender_id: '',
            birth_date: ''
        });
    }

    argumentsRelationsObject(): object
    {
        const configGenders = {
            key: 'pulsar-forem.genders'
        };

        return {
            configGenders
        };
    }

    setRelationsData(data: any): void
    {
        // profiles
        this.profiles = data.foremProfiles;

        // set genders
        this.genders = data.foremGenders;
    }
}