import { Component, Injector, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { CoreDetailComponent } from './../../../core/structures/core-detail-compoment';
import { graphQL } from './expedient.graphql';
import { Modality } from '../forem.models';

@Component({
    selector: 'dh2-forem-expedient-detail',
    templateUrl: 'expedient-detail.component.html',
    animations: fuseAnimations
})
export class ExpedientDetailComponent extends CoreDetailComponent  implements OnInit
{
    objectTranslation = 'FOREM.EXPEDIENT';
    objectTranslationGender = 'F';
    modalities: Modality[] = [];
    showCode = false;

    constructor(
        protected injector: Injector
    ) {
        super(injector, graphQL);
    }

    createForm(): void
    {
        this.fg = this.fb.group({
            id: [{value: '', disabled: true}],
            modality_id: ['', Validators.required],
            year: ['', Validators.required],
            code: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
            name: ['', Validators.required],
            starts_at: '',
            ends_at: ''
        });
    }

    argumentsRelationsObject(): Object
    {
        const configModalities = {
            key: 'pulsar-forem.modalities'
        };

        return {
            configModalities
        };
    }

    setRelationsData(data: any): void
    {
        // set modalities
        this.modalities = <Modality[]>data.foremModalities;
    }

    afterPatchValueEdit(): void
    {
        this.handleChangeModality({value: this.object.modality_id});
    }

    handleChangeModality($event): void
    {
        if ($event.value === 1)
        {
            this.fg.get('code').setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(3)]);
            this.showCode = true;
        }
        else
        {
            this.fg.get('code').clearValidators();
            this.fg.get('code').setValue('');
            this.showCode = false;
        }
        this.fg.get('code').updateValueAndValidity();
    }
}
