import { Injectable } from '@angular/core';
import { GraphQLModel } from './../../core/graphql/graphql-model.class';
import gql from 'graphql-tag';

@Injectable()
export class CustomerClassTaxGraphQLService extends GraphQLModel {

    queryPaginationObject = gql`
        query MarketGetCustomerClassTaxesPagination ($sql:[CoreSQLQueryInput]) {
            coreObjectsPagination: marketCustomerClassTaxesPagination (sql:$sql) {
                total
                filtered
                objects (sql:$sql) {
                    ${this.fields}
                }
            }
        }`;

    queryObjects = gql`
        query MarketGetCustomerClassTaxes ($sql:[CoreSQLQueryInput]) {
            coreObjects: marketCustomerClassTaxes (sql:$sql){
                ${this.fields}
            }
        }`;

    queryObject = gql`
        query MarketGetCustomerClassTax ($sql:[CoreSQLQueryInput]) {
            coreObject: marketCustomerClassTax (sql:$sql){
                ${this.fields}
            }
        }`;

    mutationAddObject = gql`
        mutation MarketAddCustomerClassTax ($object:MarketCustomerClassTaxInput!) {
            marketAddCustomerClassTax (object:$object){
                ${this.fields}
            }
        }`;

    mutationUpdateObject = gql`
        mutation MarketUpdateCustomerClassTax ($object:MarketCustomerClassTaxInput!) {
            marketUpdateCustomerClassTax (object:$object){
                ${this.fields}
            }
        }`;

    mutationDeleteObject = gql`
        mutation MarketDeleteCustomerClassTax ($id:Int!) {
            marketDeleteCustomerClassTax (id:$id){
                ${this.fields}
            }
        }`;

    init() {
        // model of backoffice relative at this GraphQL service
        this.objectModel = 'Syscover\\Market\\Models\\CustomerClassTax';

        // defaults fields that will be return, fragment necessary for return CoreObjectInterface
        this.fields = `
            ... on MarketCustomerClassTax {
                id
                name 
            }
        `;

        super.init();
    }
}