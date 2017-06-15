import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { SelectItem } from 'primeng/primeng';

import { CoreDetailComponent } from './../../shared/super/core-detail.component';

import { ArticleService } from './article.service';
import { CategoryService } from '../category/category.service';
import { FamilyService } from '../family/family.service';
import { SectionService } from '../section/section.service';
import { AuthService } from './../../core/auth/auth.service';
import { DynamicFormService } from './../../shared/components/forms/dynamic-form/dynamic-form.service';

import { User } from './../../admin/admin.models';
import { Section, Family, Article, Category } from './../cms.models';
import { Field } from './../../admin/admin.models';

import * as _ from 'lodash';

@Component({
    selector: 'ps-article-detail',
    templateUrl: './article-detail.component.html'
})
export class ArticleDetailComponent extends CoreDetailComponent implements OnInit {

    sections: SelectItem[] = [];
    families: SelectItem[] = [];
    statuses: SelectItem[] = [];
    articles: SelectItem[] = [];
    categories: SelectItem[] = [];
    user: User = new User();

    family: Family = new Family();
    private _sections: Section[];
    private _families: Family[];

    // custom fields
    fields: Field[];

    // paramenters for parent class
    object: Article = new Article(); // set empty object
    customCallback: Function = (response = undefined) => {
        if (this.dataRoute.action === 'edit' || this.dataRoute.action === 'create-lang') {
            this.object = response.data; // function to set custom data
            // change publish and date format to Date, for calendar component
            this.object.publish = new Date(this.object.publish);
            if (this.object.date) this.object.date = new Date(this.object.date);
            // set values of form, if the object not match with form, use pachValue instead of setValue
            this.fg.patchValue(this.object);
            // set family to confogn form template
            this.family = this.object.family;
            // set attachments in FormArray from ps-attachment-files-library component
            //this.attachments.setValue(this.object.attachments);


            // categories
            this.fg.controls['categories_id'].setValue(_.map(this.object.categories, 'id')); // set categories extracting ids
            // set tags
            this.fg.controls['tags'].setValue(_.map(this.object.tags, 'name')); // set tags extracting name field
            // set tags extracting name field
            this.fg.controls['author_name'].setValue(this.object.author.name + ' ' + this.object.author.surname);

            // get fields if object has field group
            /*if (this.object.field_group_id) {
                // set FormGroup with custom FormControls
                this.handleGetCustomFields(this.object.data.properties);
            }*/

            if (this.dataRoute.action === 'create-lang') {
                this.fg.patchValue({
                    // set lang id in form from object with multiple language
                    lang_id: this.lang.id
                });
            }
        }
    }

    constructor(
        protected injector: Injector,
        protected objectService: ArticleService,
        private sectionService: SectionService,
        private familyService: FamilyService,
        private categoryService: CategoryService,
        private authService: AuthService,
        private dynamicFormService: DynamicFormService
    ) {
        super(injector, objectService);
    }

    ngOnInit() {

        this.sectionService
            .getRecords()
            .flatMap((response) => {
                this._sections = response.data;
                this.sections = _.map(this._sections, obj => {
                    return { value: obj.id, label: obj.name };
                });
                this.sections.unshift({ label: 'Select a section', value: '' });

                return this.familyService.getRecords(); // return next observable
            }).flatMap(response => {
                this._families = response.data;
                this.families = _.map(this._families, obj => {
                    return { value: obj.id, label: obj.name };
                });
                this.families.unshift({ label: 'Select a family', value: '' });

                // load articles to select a parent
                let query = {
                    type: 'query',
                    parameters: [
                        {
                            command: 'where',
                            column: 'article.lang_id',
                            operator: '=',
                            value: this.params['lang'] ? this.params['lang'] : this.baseLang
                        },
                        {
                            command: 'orderBy',
                            operator: 'asc',
                            column: 'article.name'
                        }
                    ]
                };

                // set id of product if action is edit
                if (this.params['id']) {
                    query.parameters.push({
                        command: 'where',
                        column: 'article.id',
                        operator: '<>',
                        value: this.params['id']
                    });
                };

                return this.objectService.searchRecords(query); // return next observable
            }).flatMap(response => {
                // set articles dropdown
                this.articles = _.map(<Article[]>response.data, obj => {
                    return { value: obj.id, label: obj.name };
                }); // get order status

                this.articles.unshift({ label: 'Select a article', value: '' });

                return this.categoryService.searchRecords({
                    type: 'query',
                    parameters: [
                        {
                            command: 'where',
                            column: 'article_category.lang_id',
                            operator: '=',
                            value: this.params['lang'] ? this.params['lang'] : this.baseLang
                        },
                        {
                            command: 'orderBy',
                            operator: 'asc',
                            column: 'article_category.name'
                        }
                    ]
                }); // return next observable
            }).flatMap(response => {
                // set categories dropdown
                this.categories = _.map(<Category[]>response.data, obj => {
                    return { value: obj.id, label: obj.name };
                }); // get categories

                return this.configService.getValue({
                    key: 'pulsar.cms.statuses',
                    translate: {
                        lang: this.baseLang,
                        property: 'name'
                    }
                }); // return next observable
            }).subscribe(response => {
                this.statuses = _.map(<Family[]>response.data, obj => {
                    return { value: obj.id, label: obj.name };
                });
                this.statuses.unshift({ label: 'Select a status', value: '' });

                // get actual user for author
                this.user = this.authService.user();
                this.fg.patchValue({
                    author_id: this.user.id,
                    author_name: this.user.name + ' ' + this.user.surname
                });
                super.init();
            });
    }

    createForm() {
        this.fg = this.fb.group({
            id: [{value: '', disabled: true}, Validators.required ],
            lang_id: ['', Validators.required],
            name: ['', Validators.required],
            parent_article_id: '',
            author_id: '',
            author_name: [{value: '', disabled: true}],
            section_id: ['', Validators.required],
            family_id: '',
            status_id: ['', Validators.required],
            publish: '',
            publish_text: '',
            date: '',
            title: '',
            categories_id: [],
            slug: '',
            link: '',
            blank: '',
            sort: null,
            tags: [],
            article: '',
            attachments: this.fb.array([])
        });
    }

    handleChangeSection($event) {
        // change family if, change section
        if ($event.value) {
            let section = _.find(this._sections, {id: $event.value});
            this.fg.controls['family_id'].setValue(section.family.id);
            this.family = section.family;
        }
    }

    handleChangeFamily($event) {
        if ($event.value) {
            let family = _.find(this._families, {id: $event.value});
            this.family = family;
        }
    }

    // get custom fields that has this object
    handleGetCustomFields(properties = undefined) {
        this.dynamicFormService.instance(
            this.fg,
            properties,
            (fields) => {
                this.fields = fields;
            });
    }
}