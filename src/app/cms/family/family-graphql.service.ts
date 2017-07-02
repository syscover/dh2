import { Injectable } from '@angular/core';
import { GraphQLModel } from './../../core/graphql/graphql-model';
import gql from 'graphql-tag';

@Injectable()
export class FamilyGraphQLService implements GraphQLModel {

    readonly objectInputContainer = 'family'; // to know which is the wrapper that will contain an object for to pass arguments
    readonly objectContainer = 'cmsFamily'; // to know which is the wrappper that contain a object in response
    readonly paginationContainer = 'cmsFamiliesPagination'; // to know wich is the wrapper that contain pagination in response
    readonly relationsFields = `
        coreConfig (config:$config) {
            ... on CoreConfigOptionType {
                id
                name
            }
        }
        adminFieldGroups {
            id
            name
        }
    `; // fields of relations object`
    readonly fields = `
    ... on CmsFamily {
            id
            name
            editor_id
            field_group_id 
            date 
            title
            slug
            link
            categories
            sort
            tags
            article_parent
            attachments
            data
        }
    `; // defaults fields that will be return, fragment inline only is necessary for pagination

    readonly queryRelationsObject = gql`
        query CmsGetRelationsFamily($config:CoreConfigInput!) {
            ${this.relationsFields}
        }`;

    readonly queryPaginationObject = gql`
        query CmsGetFamiliesPagination ($sql:[CoreSQLQueryInput]) {
            ${this.paginationContainer} (sql:$sql) {
                total
                filtered
                objects (sql:$sql){
                    ${this.fields}
                }
            }
        }`;

    readonly queryObjects = gql`
        query GetCmsFamilies ($sql:[CoreSQLQueryInput] $config:CoreConfigInput!) {
            cmsFamilies (sql:$sql){
                ${this.fields}
            }
            ${this.relationsFields}
        }`;

    readonly queryObject = gql`
        query GetCmsFamily ($sql:[CoreSQLQueryInput] $config:CoreConfigInput!) {
            cmsFamily (sql:$sql){
                ${this.fields}
            }
            ${this.relationsFields}
        }`;

    readonly mutationAddObject = gql`
        mutation CmsAddFamily ($family:CmsFamilyInput!) {
            cmsAddFamily (family:$family){
                ${this.fields}
            }
        }`;

    readonly mutationUpdateObject = gql`
        mutation CmsUpdateFamily ($family:CmsFamilyInput!) {
            cmsUpdateFamily (family:$family){
                ${this.fields}
            }
        }`;

    readonly mutationDeleteObject = gql`
        mutation CmsDeleteFamily ($id:String!) {
            cmsDeleteFamily (id:$id){
                ${this.fields}
            }
        }`;
}
