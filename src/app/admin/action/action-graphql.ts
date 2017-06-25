import { GraphQLModel } from './../../core/graphql/graphql-model';
import gql from 'graphql-tag';

export class ActionGraphQL implements GraphQLModel {

    readonly objectInputContainer = 'action'; // to know which is the wrapper that will contain an object for to pass arguments
    readonly objectsContainer = 'actions'; // to know which is the wrapper that contain objects list in response
    readonly objectContainer = 'adminAction'; // to know which is the wrappper that contain a object in response
    readonly paginationContainer = 'adminActionsPagination'; // to know wich is the wrapper that contain pagination in response
    readonly fields = 'id name'; // defaults fields that will be return

    readonly queryObjects = gql`
        query GetAdminActionsPagination ($sql:[CoreSQLQueryInput]) {
            ${this.paginationContainer} (sql:$sql) {
                total
                filtered
                ${this.objectsContainer}(sql:$sql){
                    ${this.fields}
                }
            }
        }`;

    readonly queryObject = gql`
        query GetAdminAction ($sql:[CoreSQLQueryInput]) {
            adminAction (sql:$sql){
                ${this.fields}
            }
        }`;

    readonly mutationAddObject = gql`
        mutation adminAddAction ($action:AdminActionInput!) {
            adminAddAction (action:$action){
                ${this.fields}
            }
        }`;

    readonly mutationUpdateObject = gql`
        mutation AdminAddAction ($action:AdminActionInput! $idOld:String!) {
            adminUpdateAction (action:$action idOld:$idOld){
                ${this.fields}
            }
        }`;

    readonly mutationDeleteObject = gql`
        mutation AdminDeleteAction ($id:String!) {
            adminDeleteAction (id:$id){
                ${this.fields}
            }
        }`;
}