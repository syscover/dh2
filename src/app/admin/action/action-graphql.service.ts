import { Injectable } from '@angular/core';
import { GraphQLModel } from './../../core/graphql/graphql-model.class';
import gql from 'graphql-tag';


export class ActionGraphQLService extends GraphQLModel {

    queryPaginationObject = gql`
        query AdminGetActionsPagination ($sql:[CoreSQLQueryInput]) {
            coreObjectsPagination: adminActionsPagination (sql:$sql) {
                total
                filtered
                objects (sql:$sql)
            }
        }`;

    queryObjects = gql`
        query AdminGetActions ($sql:[CoreSQLQueryInput]) {
            coreObjects: adminActions (sql:$sql) {
                ${this.fields}
            }
        }`;

    queryObject = gql`
        query AdminGetAction ($sql:[CoreSQLQueryInput]) {
            coreObject: adminAction (sql:$sql) {
                ${this.fields}
            }
        }`;

    mutationAddObject = gql`
        mutation AdminAddAction ($object:AdminActionInput!) {
            adminAddAction (object:$object){
                ${this.fields}
            }
        }`;

    mutationUpdateObject = gql`
        mutation AdminUpdateAction ($object:AdminActionInput!) {
            adminUpdateAction (object:$object) {
                ${this.fields}
            }
        }`;

    mutationDeleteObject = gql`
        mutation AdminDeleteAction ($object_id:String!) {
            adminDeleteAction (object_id:$object_id) {
                ${this.fields}
            }
        }`;

    init() {
        this.model = 'Syscover\\Admin\\Models\\Action';
        this.table = 'admin_action';

        // defaults fields that will be return, fragment necessary for return CoreObjectInterface
        this.fields = `
            ... on AdminAction {
                id
                object_id
                name
            }
        `;

        super.init();
    }
}
