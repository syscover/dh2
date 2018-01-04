import { identifierModuleUrl } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { GraphQLSchema } from './../../../core/graphql/graphql-schema.class';
import gql from 'graphql-tag';

@Injectable()
export class OrderGraphQLService extends GraphQLSchema {

    queryPaginationObject = gql`
        query MarketGetOrdersPagination ($sql:[CoreSQLQueryInput]) {
            coreObjectsPagination: marketOrdersPagination (sql:$sql) {
                total
                filtered
                objects (sql:$sql)
            }
        }`;

    queryObjects = gql`
        query MarketGetOrders ($sql:[CoreSQLQueryInput]) {
            coreObjects: marketOrders (sql:$sql){
                ${this.fields}
            }
        }`;

    queryObject = gql`
        query MarketGetOrder (
            $sql:[CoreSQLQueryInput]
        ) {
            coreObject: marketOrder (sql:$sql){
                ${this.fields}
            }
            ${this.relationsFields}
        }`;

    mutationAddObject = gql`
        mutation MarketAddOrder ($object:MarketOrderInput!) {
            marketAddOrder (object:$object){
                ${this.fields}
            }
        }`;

    mutationUpdateObject = gql`
        mutation MarketUpdateOrder ($object:MarketOrderInput!) {
            marketUpdateOrder (object:$object){
                ${this.fields}
            }
        }`;

    mutationDeleteObject = gql`
        mutation MarketDeleteOrder ($id:Int!) {
            marketDeleteOrder (id:$id){
                ${this.fields}
            }
        }`;

    init() {
        this.model = 'Syscover\\Market\\Models\\Order';
        this.table = 'market_order';

        // defaults fields that will be return, fragment necessary for return CoreObjectInterface
        this.fields = `
            ... on MarketOrder {
                id
                date
                status_id
                ip
                transaction_id
                rows {
                    id
                    name
                    quantity
                    subtotal
                }
                customer_company
                customer_tin
                customer_name
                customer_surname
                customer_email
                customer_mobile
                shipping_amount
                subtotal
                total
            }
        `;

        this.relationsFields = `
            marketOrderStatuses {
                ix
                id
                lang_id 
                name 
                active
                data_lang
            }
            marketPaymentMethods {
                ix
                id
                lang_id 
                name
                sort
                active
            }
        `;

        super.init();
    }
}