import { Injectable } from '@angular/core';
import { GraphQLModel } from './../../core/graphql/graphql-model.class';
import gql from 'graphql-tag';

@Injectable()
export class SectionGraphQLService extends GraphQLModel {

    queryPaginationObject = gql`
        query CmsGetSectionsPagination ($sql:[CoreSQLQueryInput]) {
            coreObjectsPagination: cmsSectionsPagination (sql:$sql) {
                total
                filtered
                objects (sql:$sql) {
                    ${this.fields}
                }
            }
        }`;

    queryRelationsObject = gql`
        query CmsGetRelationsSection {
            ${this.relationsFields}
        }`;

    queryObjects = gql`
        query CmsGetSections ($sql:[CoreSQLQueryInput]) {
            coreObjects: cmsSections (sql:$sql){
                ${this.fields}
            }
            ${this.relationsFields}
        }`;

    queryObject = gql`
        query CmsGetSection ($sql:[CoreSQLQueryInput]) {
            coreObject: cmsSection (sql:$sql){
                ${this.fields}
            }
            ${this.relationsFields}
        }`;

    mutationAddObject = gql`
        mutation CmsAddSection ($object:CmsSectionInput!) {
            cmsAddSection (object:$object){
                ${this.fields}
            }
        }`;

    mutationUpdateObject = gql`
        mutation CmsUpdateSection ($object:CmsSectionInput! $idOld:String!) {
            cmsUpdateSection (object:$object idOld:$idOld){
                ${this.fields}
            }
        }`;

    mutationDeleteObject = gql`
        mutation CmsDeleteSection ($id:String!) {
            cmsDeleteSection (id:$id){
                ${this.fields}
            }
        }`;

    init() {
        // model of backoffice relative at this GraphQL service
        this.objectModel = 'Syscover\\Cms\\Models\\Section';

        // defaults fields that will be return, fragment necessary for return CoreObjectInterface
        this.fields = `
            ... on CmsSection {
                id
                name
                article_family_id
                family {
                    id
                    name
                }
            }
        `;

        this.relationsFields = `
            cmsFamilies {
                id
                name
            }
        `;

        super.init();
    }
}
