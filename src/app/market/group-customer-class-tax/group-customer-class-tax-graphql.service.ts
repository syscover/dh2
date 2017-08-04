import { Injectable } from '@angular/core';
import { GraphQLModel } from './../../core/graphql/graphql-model.class';
import gql from 'graphql-tag';

@Injectable()
export class GroupCustomerClassTaxGraphQLService extends GraphQLModel {

    queryPaginationObject = gql`
        query MarketGetGroupCustomerClassTaxesPagination ($sql:[CoreSQLQueryInput]) {
            coreObjectsPagination: marketGroupCustomerClassTaxesPagination (sql:$sql) {
                total
                filtered
                objects (sql:$sql)
            }
        }`;

    queryRelationsObject  = gql`
        query MarketGetRelationsArticle {
            ${this.relationsFields}
        }`;

    queryObjects = gql`
        query MarketGetGroupCustomerClassTaxes ($sql:[CoreSQLQueryInput]) {
            coreObjects: marketGroupCustomerClassTaxes (sql:$sql){
                ${this.fields}
            }
            ${this.relationsFields}
        }`;

    queryObject = gql`
        query MarketGetGroupCustomerClassTax ($sql:[CoreSQLQueryInput]) {
            coreObject: marketGroupCustomerClassTax (sql:$sql){
                ${this.fields}
            }
            ${this.relationsFields}
        }`;

    mutationAddObject = gql`
        mutation MarketAddGroupCustomerClassTax ($object:MarketGroupCustomerClassTaxInput!) {
            marketAddGroupCustomerClassTax (object:$object){
                ${this.fields}
            }
        }`;

    mutationUpdateObject = gql`
        mutation MarketUpdateGroupCustomerClassTax ($group_id:Int! $customer_class_tax_id:Int! $object:MarketGroupCustomerClassTaxInput!) {
            marketUpdateGroupCustomerClassTax (group_id:$group_id customer_class_tax_id:$customer_class_tax_id object:$object){
                ${this.fields}
            }
        }`;

    mutationDeleteObject = gql`
        mutation MarketDeleteGroupCustomerClassTax ($group_id:Int! $customer_class_tax_id:Int!) {
            marketDeleteGroupCustomerClassTax (group_id:$group_id customer_class_tax_id:$customer_class_tax_id){
                ${this.fields}
            }
        }`;

    init() {
        // model of backoffice relative at this GraphQL service
        this.objectModel = 'Syscover\\Market\\Models\\GroupCustomerClassTax';

        // defaults fields that will be return, fragment necessary for return CoreObjectInterface
        this.fields = `
            ... on MarketGroupCustomerClassTax {
                group_id
                customer_class_tax_id 
            }
        `;

        this.relationsFields = `
            crmGroups {
                id
                name
            }
            marketCustomerClassTaxes {
                id
                name
            }
        `;

        super.init();
    }
}