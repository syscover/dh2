import gql from 'graphql-tag';
import { graphQL as foremCategoryGraphQL } from '../category/category.graphql';

const fields = `
    id
    code
    name
    slug
    category_id
    target_id
    assistance_id
    type_id
    certificate
    certificate_code
    hours
    price_total
    price_hour    
    contents_excerpt
    contents
    requirements   
    observations
`;

const relationsFields = `
    foremCategories {
        ${foremCategoryGraphQL.fields}
    }
    foremTargets: coreConfig (config:$configTargets)
    foremAssistances: coreConfig (config:$configAssistances)
    foremTypes: coreConfig (config:$configTypes)
`;

export const graphQL = {
    model: 'Syscover\\Forem\\Models\\Action',
    table: 'forem_action',
    fields,
    relationsFields,

    queryPaginationObject: gql`
        query ForemGetActionsPagination ($sql:[CoreSQLInput] $configAssistances:CoreConfigInput $configTypes:CoreConfigInput) {
            coreObjectsPagination: foremActionsPagination (sql:$sql) {
                total
                objects (sql:$sql)
                filtered
            }
            foremAssistances: coreConfig (config:$configAssistances)
            foremTypes: coreConfig (config:$configTypes)
        }`,

    queryRelationsObject: gql`
        query ForemGetRelationsCategory ($configTargets:CoreConfigInput $configAssistances:CoreConfigInput $configTypes:CoreConfigInput) {
            ${relationsFields}
        }`,

    queryObjects: gql`
        query ForemGetActions ($sql:[CoreSQLInput] $configTargets:CoreConfigInput $configAssistances:CoreConfigInput $configTypes:CoreConfigInput) {
            coreObjects: foremActions (sql:$sql) {
                ${fields}
            }
            ${relationsFields}
        }`,

    queryObject: gql`
        query ForemGetAction ($sql:[CoreSQLInput] $configTargets:CoreConfigInput $configAssistances:CoreConfigInput $configTypes:CoreConfigInput) {
            coreObject: foremAction (sql:$sql) {
                ${fields}
            }
            ${relationsFields}
        }`,

    mutationCreateObject: gql`
        mutation ForemCreateAction ($payload:ForemActionInput!) {
            foremCreateAction (payload:$payload) {
                ${fields}
            }
        }`,

    mutationUpdateObject: gql`
        mutation ForemUpdateAction ($payload:ForemActionInput!) {
            foremUpdateAction (payload:$payload) {
                ${fields}
            }
        }`,

    mutationDeleteObject: gql`
        mutation ForemDeleteAction ($id:Int!) {
            foremDeleteAction (id:$id) {
                ${fields}
            }
        }`
};
