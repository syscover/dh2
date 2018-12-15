import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ValidationMessageService } from './../../../core/services/validation-message.service';
import { HttpService } from '../../../core/services/http.service';
import { graphQL } from './../../../apps/market/category/category.graphql';
import { Category } from '../../../apps/market/market.models';
import { Lang } from '../../../apps/admin/admin.models';
import { ConfigService } from '../../../core/services/config.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SelectSearchService } from '../../services/select-search.service';

@Component({
    selector: 'dh2-market-category-dialog',
    template: `
        <dh2-spinner [show]="showSpinner"></dh2-spinner>
        <h1 mat-dialog-title>
            <mat-icon>chrome_reader_mode</mat-icon>
            {{ 'APPS.CATEGORY' | translate }}
            <dh2-flag-icon class="d-inline ml-40" [lang]="lang" size="22px" [rounded]="true"></dh2-flag-icon>
        </h1>
        <div mat-dialog-content>
            <form id="formCategoryDialogDetail" 
                  [formGroup]="fg" 
                  (ngSubmit)="postRecord()">
                
                <input type="hidden" formControlName="id">
                
                <div fxLayout="column" fxFlex>
                    <div fxLayout="row">
                        <mat-form-field class="col-12 col-md-6">
                            <mat-select placeholder="{{ 'MARKET.PARENT_CATEGORY' | translate }}" formControlName="parent_id">
                                <ngx-mat-select-search [formControl]="categoryFilterCtrl"
                                                       placeholderLabel="{{ 'APPS.SEARCH' | translate }}"
                                                       noEntriesFoundLabel="{{ 'APPS.NO_MATCHING' | translate }}"></ngx-mat-select-search>
                                <mat-option *ngFor="let category of filteredCategories | async" [value]="category.id">{{ category.name }}</mat-option>
                            </mat-select>
                            <mat-error>{{ formErrors?.parent_id }}</mat-error>
                        </mat-form-field>
                    </div>
                    
                    <div fxLayout="row">
                        <mat-form-field class="col-12">
                            <input dh2Slug [model]="graphQL.model" (checkingSlug)="handleCheckingSlug($event)" matInput placeholder="{{ 'APPS.NAME' | translate }}" formControlName="name" required>
                            <mat-error>{{ formErrors?.name }}</mat-error>
                        </mat-form-field>
                    </div>

                    <div fxLayout="row">
                        <mat-form-field class="col-12">
                            <mat-spinner *ngIf="loadingSlug" matPrefix mode="indeterminate" diameter="17" class="mr-10"></mat-spinner>
                            <input dh2Slug [model]="graphQL.model" (checkingSlug)="handleCheckingSlug($event)" matInput placeholder="{{ 'APPS.SLUG' | translate }}" formControlName="slug" required>
                            <mat-error>{{ formErrors?.slug }}</mat-error>
                        </mat-form-field>
                    </div>
                </div>
            </form>
        </div>
        <div mat-dialog-actions>
            
            <button mat-raised-button
                    type="submit"
                    form="formCategoryDialogDetail"
                    class="mat-accent mr-16"
                    [disabled]="fg.pristine || loadingButton || loadingSlug" 
                    cdkFocusInitial>
                    {{ 'APPS.SAVE' | translate }}
                    <mat-spinner mode="indeterminate" diameter="17" *ngIf="loadingButton"></mat-spinner>
            </button>
            
            <button mat-raised-button 
                    [mat-dialog-close]="false">
                {{ 'APPS.CANCEL' | translate }}
            </button>
            
        </div>
    `
})
export class CategoryDialogComponent implements OnInit, OnDestroy
{
    fg: FormGroup;
    lang: Lang;
    formErrors: any = {};
    graphQL = graphQL;
    loadingSlug = false;
    loadingButton = false;
    showSpinner = false;

    // categories
    categories: Category[] = [];
    categoryFilterCtrl: FormControl = new FormControl();
    filteredCategories: ReplaySubject<Category[]> = new ReplaySubject<Category[]>(1);

    protected _onDestroy = new Subject();

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _dialogRef: MatDialogRef<CategoryDialogComponent>,
        private _fb: FormBuilder,
        private _config: ConfigService,
        private _validationMessageService: ValidationMessageService,
        private _http: HttpService,
        private _selectSearch: SelectSearchService
    )
    {
        this.createForm();
    }

    createForm(): void
    {
        this.fg = this._fb.group({
            id: '',
            lang_id: ['', Validators.required],
            parent_id: '',
            name: ['', Validators.required],
            slug: ['', Validators.required]
        });
    }

    ngOnInit(): void
    {
        this.showSpinner = true;

        this._validationMessageService.subscribeForm(this.fg, this.formErrors);
        this.lang = this.data.lang;

        // categories
        this.categories = this.data.categories;
        this.filteredCategories.next(this.categories.slice());

        this.fg.patchValue({
            lang_id: this.lang.id // set lang id in form from object with multiple language
        });

        this.setSelectSearch();

        this.showSpinner = false;
    }

    ngOnDestroy(): void
    {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    setSelectSearch(): void
    {
        // category
        this.categoryFilterCtrl
            .valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this._selectSearch.filterSelect(
                    this.categoryFilterCtrl,
                    this.categories,
                    this.filteredCategories
                );
            });
    }

    postRecord(): void
    {
        if (this.fg.valid)
        {
            this.loadingButton = true;

            const ob$ = this._http
                .apolloClient()
                .mutate({
                    mutation: this.graphQL.mutationCreateObject,
                    variables: {
                        payload: this.fg.value
                    }
                })
                .subscribe(res => {

                    ob$.unsubscribe();
                    this.loadingButton = false;
                    this._dialogRef.close(res.data.marketCreateCategory);
                });
        }
    }

    handleCheckingSlug($event): void
    {
        this.loadingSlug = $event;
    }
}