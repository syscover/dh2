import { Component, OnInit, Injector } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { CoreDetailComponent } from './../../shared/super/core-detail.component';

import { AttachmentFamilyService } from './attachment-family.service';
import { Resource, AttachmentFamily } from './../admin.models';

// custom imports
import { ResourceService } from './../resource/resource.service';
import { SelectItem } from 'primeng/primeng';

import * as _ from 'lodash';

@Component({
    selector: 'ps-attachment-family-detail',
    templateUrl: './attachment-family-detail.component.html'
})
export class AttachmentFamilyDetailComponent extends CoreDetailComponent implements OnInit {

    private resources: SelectItem[] = [];

    // paramenters for parent class
    private object: AttachmentFamily = new AttachmentFamily(); // set empty object
    private f: Function = (response = undefined) => {
        if (this.dataRoute.action === 'edit') {
            this.object = response.data; // function to set custom data
            this.fg.patchValue(this.object); // set values of form
        }
    }

    constructor(
        protected injector: Injector,
        protected objectService: AttachmentFamilyService,
        protected resourceService: ResourceService
    ) {
        super(injector);
    }

    ngOnInit() {
        this.createForm(); // create form

        this.resourceService.getRecords()
            .subscribe((response) => {

            this.resources = _.map(<Resource[]>response.data, obj => {
                return { value: obj.id, label: obj.name };
            }); // get resources

            this.resources.unshift({ label: 'Select a resource', value: '' });
            super.getRecordHasIdParamenter(this.f);
        });
    }

    createForm() {
        this.fg = this.fb.group({
            id: [{value: '', disabled: true}],
            resource_id: ['', Validators.required ],
            name: ['', Validators.required ],
            width: null,
            height: null
        });
    }
}