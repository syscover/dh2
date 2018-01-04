import { Component, Injector, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { CoreDetailComponent } from './../../../core/super/core-detail.component';
import { ProductGraphQLService } from './product-graphql.service';
import { Product, Category, ProductType, PriceType, ProductClassTax, Stock } from './../market.models';
import { StockGraphQLService } from './../stock/stock-graphql.service';
import { AttachmentFilesLibraryComponent } from './../../../shared/components/forms/attachment-files-library/attachment-files-library/attachment-files-library.component';
import { DynamicFormService } from './../../../shared/components/forms/dynamic-form/dynamic-form.service';
import { Field, FieldGroup, AttachmentFamily, FieldValue } from './../../admin/admin.models';
import { ConfigService } from '../../../core/services/config.service';
import { environment } from './../../../../environments/environment';
import * as _ from 'lodash';
import gql from 'graphql-tag';

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'ps-product-detail',
    templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent extends CoreDetailComponent {

    categories: SelectItem[] = [];
    productTypes: SelectItem[] = [];
    priceTypes: SelectItem[] = [];
    productClassTaxes: SelectItem[] = [];
    attachmentFamilies: AttachmentFamily[] = [];
    products: SelectItem[] = [];
    stocksData: any[] = [];

    // custom fields
    fieldGroups: SelectItem[] = [];
    fields: Field[];
    fieldValues: FieldValue[];

    @ViewChild('stocksDataTable') private stocksDataTable;
    @ViewChild('attachments') private attachments: AttachmentFilesLibraryComponent;
    @ViewChild('productClassTax') private productClassTax;

    // paramenters for parent class
    object: Product = new Product(); // set empty object

    constructor(
        protected injector: Injector,
        protected graphQL: ProductGraphQLService,
        private graphQLStock: StockGraphQLService,
        private dynamicFormService: DynamicFormService,
        public configService: ConfigService
    ) {
        super(injector, graphQL);
    }

    // function call from parent
    createForm() {
        this.fg = this.fb.group({
            ix: null,
            id: null,
            lang_id: ['', Validators.required],
            code: '',
            categories_id: [[], Validators.required],
            name: ['', Validators.required ],
            slug: ['', Validators.required ],
            field_group_id: '',
            type_id: ['', Validators.required],
            parent_id: '',
            weight: [null, Validators.required],
            active: '',
            sort: [null, Validators.required],
            price_type_id: ['', Validators.required],
            product_class_tax_id: ['', Validators.required],
            description: '',
            price: null,
            subtotal: null,
            subtotal_format: [{value: null, disabled: true}, Validators.required ],
            tax_format: [{value: null, disabled: true}, Validators.required ],
            total_format: [{value: null, disabled: true}, Validators.required ],
            attachments: this.fb.array([])
        });
    }

    postRecord(object: any, routeRedirect: string = undefined, params = []) {
        super.postRecord(object, routeRedirect, params);
    }

    // get taxes for product
    handleGetProductTaxes(subtotal = undefined, forceCalculatePriceWithoutTax = undefined, callback = undefined): void {

        // subtotal is defined when load element
        let price = subtotal ? subtotal : this.fg.controls['price'].value;

        if (! price) {
            if (callback) callback();
            return;
        }

        let args = {
            price: price,
            productClassTax: this.fg.controls['product_class_tax_id'].value
        };

        // force to calualte price without tax, when show product the price always
        // is without tax because is subtotal the refernece price, this flag is activated in
        // function setData os this component
        if (forceCalculatePriceWithoutTax) {
            args['productTaxPrices'] = 1;
        }

        const ob = this.objectService
            .apolloClient()
            .watchQuery({
                fetchPolicy: 'network-only',
                query: gql`
                    query MarketProductTaxes ($price:Float! $productClassTax:Int $productTaxPrices:Int) {
                        marketProductTaxes (price:$price productClassTax:$productClassTax productTaxPrices:$productTaxPrices)
                    }
                `,
                variables: args
            })
            .valueChanges
            .subscribe(({data}) => {
                ob.unsubscribe();
                if (environment.debug) console.log('DEBUG - response of marketProductTaxes query: ', data);

                this.fg.controls['subtotal'].setValue(data['marketProductTaxes']['subtotal']);
                this.fg.controls['subtotal_format'].setValue(data['marketProductTaxes']['subtotalFormat']);
                this.fg.controls['tax_format'].setValue(data['marketProductTaxes']['taxAmountFormat']);
                this.fg.controls['total_format'].setValue(data['marketProductTaxes']['totalFormat']);

                if (callback) callback();
            });
    }

    // get custom fields that has this object
    handleGetCustomFields() {
        // get properties for get values of custom fields
        let customFields = this.object.data && this.object.data.customFields ? this.object.data.customFields : undefined;

        this.dynamicFormService.instance(
            this.fg.get('field_group_id').value,
            this.fg,
            customFields,
            (fields) => {
                this.fields = fields;
            });
    }

    setData (response = undefined) {
        if (this.dataRoute.action === 'edit' || this.dataRoute.action === 'create-lang') {
            this.object = response; // function to set custom data
            this.fg.patchValue(this.object); // set values of form, if the object not match with form, use pachValue instead of setvelue

            // set categories extracting ids
            this.fg.controls['categories_id'].setValue(_.map(this.object.categories, 'id'));

            this.handleGetProductTaxes(
                this.fg.controls['subtotal'].value,
                true, // force to calulate price without tax
                // callback, all http petition must to be sequential to pass JWT
                () => {
                    // get fields if object has field group
                    if (this.object.field_group_id) {
                        // set FormGroup with custom FormControls
                        this.handleGetCustomFields();
                    }
                }
            ); // calculate tax prices

            if (this.dataRoute.action === 'create-lang') {
                this.fg.patchValue({
                    // set lang id in form from object with multiple language
                    lang_id: this.lang.id
                });
            }
        }
    }

    argumentsRelationsObject(): Object {
        let sqlCategory = [
            {
                command: 'where',
                column: 'lang_id',
                operator: '=',
                value: this.params['lang_id'] ? this.params['lang_id'] : this.baseLang
            }
        ];

        let sqlAttachmentFamily = [
            {
                'command': 'where',
                'column': 'admin_attachment_family.resource_id',
                'operator': '=',
                'value': 'market-product'
            },
            {
                'command': 'orderBy',
                'operator': 'asc',
                'column': 'admin_attachment_family.name'
            }
        ];

        let sqlProduct = [
            {
                'command': 'where',
                'column': 'market_product_lang.lang_id',
                'operator': '=',
                'value': this.params['lang_id'] ? this.params['lang_id'] : this.baseLang
            },
            {
                'command': 'orderBy',
                'operator': 'asc',
                'column': 'market_product.sort'
            }
        ];

        if (this.params['id']) {
            sqlProduct.push({
                command: 'where',
                column: 'market_product.id',
                operator: '<>',
                value: this.params['id']
            });
        };

        let sqlFieldGroup = [
            {
                command: 'where',
                column: 'resource_id',
                operator: '=',
                value: 'market-product'
            }
        ];

        let sqlStock = [
            {
                command: 'where',
                column: 'product_id',
                operator: '=',
                value: this.params['id']
            }
        ];

        let configProductTypes = {
            key: 'pulsar-market.productTypes',
            lang: this.baseLang,
            property: 'name'
        };

        let configPriceTypes = {
            key: 'pulsar-market.priceTypes',
            lang: this.baseLang,
            property: 'name'
        };

        return {
            sqlCategory,
            sqlAttachmentFamily,
            sqlProduct,
            sqlFieldGroup,
            sqlStock,
            configProductTypes,
            configPriceTypes
        };
    }

    setRelationsData(data) {

        if (this.dataRoute.action === 'edit') {
            let stocksData = [];
            for (const warehouse of data['marketWarehouses']) {

                let stock = _.find(data['marketStocks'], {warehouse_id: warehouse.id});

                stocksData.push({
                    warehouse_id: warehouse.id,
                    product_id: data['coreObject']['id'],
                    name: warehouse.name,
                    stock: stock ? stock['stock'] : 0,
                    minimum_stock: stock ? stock['minimum_stock'] : 0,
                });
                this.stocksData = stocksData;
            }
        }

        // market categories
        this.categories = _.map(<Category[]>data['marketCategories'], obj => {
            return { value: obj.id, label: obj.name };
        });

        // market product class tax
        this.productClassTaxes = _.map(<ProductType[]>data['marketProductClassTaxes'], obj => {
            return { value: obj.id, label: obj.name };
        });
        this.productClassTaxes.unshift({ label: 'Select a product class tax', value: '' });

        // market product types
        this.productTypes = _.map(<ProductType[]>data['marketProductTypes'], obj => {
            return { value: obj.id, label: obj.name };
        });
        this.productTypes.unshift({ label: 'Select a product type', value: '' });

        // market price types
        this.priceTypes = _.map(<PriceType[]>data['marketPriceTypes'], obj => {
            return { value: obj.id, label: obj.name };
        });
        this.priceTypes.unshift({ label: 'Select a price type', value: '' });

        // market field groups
        this.fieldGroups = _.map(<FieldGroup[]>data['adminFieldGroups'], obj => {
            return { value: obj.id, label: obj.name };
        });
        this.fieldGroups.unshift({ label: 'Select a field group', value: '' });

        // market products
        this.products = _.map(<Product[]>data['marketProducts'], obj => {
            let code = obj.code ? ` (${obj.code})` : '';
            return { value: obj.id, label: `${obj.name}${code}` };
        });
        this.products.unshift({ label: 'Select a product', value: '' });

        // admin attachment families
        this.attachmentFamilies = <AttachmentFamily[]>data['adminAttachmentFamilies'];
    }

    handleCheckSlug($event) {
        const ob = this.objectService
            .apolloClient()
            .watchQuery({
                fetchPolicy: 'network-only',
                query: gql`
                    query MarketProductSlug ($model:String! $slug:String! $id:Int) {
                        adminCheckSlug (model:$model slug:$slug id:$id)
                    }
                `,
                variables: {
                    model: 'Syscover\\Market\\Models\\ProductLang',
                    slug: $event.target.value,
                    id: this.object.id
                }
            })
            .valueChanges
            .subscribe(({data}) => {
                ob.unsubscribe();
                if (environment.debug) console.log('DEBUG - response of query product slug: ', data);

                this.fg.controls['slug'].setValue(data['adminCheckSlug']);
            });
    }

    handleOnEditCompleteStock($event) {

        console.log('TODO: capturar envento blur', $event);

        const subs = this.objectService
            .apolloClient()
            .mutate({
                mutation: this.graphQLStock.mutationSetStock,
                variables: {
                    object: {
                        warehouse_id: $event.data.warehouse_id,
                        product_id: $event.data.product_id,
                        stock: $event.data.stock,
                        minimum_stock: $event.data.minimum_stock
                    }
                }
            })
            .subscribe(data => {
                if (environment.debug) console.log('DEBUG - set stock: ', data);
                subs.unsubscribe();
            });
    }
}