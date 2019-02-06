import gql from 'graphql-tag';

const fields = `
    id
    poll_id   
    question_id
    reviews
    total
    average
`;

export const graphQL = {

    model: 'Syscover\\Review\\Models\\QuestionAverage',
    table: 'review_question_average',
    fields
};
