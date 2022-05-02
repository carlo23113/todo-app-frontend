import gql from 'graphql-tag'

export const createTask = gql`
    mutation(
        $task_list_id: ID!
        $description: String!
    ) {
        createTask(
            task_list_id: $task_list_id
            description: $description
        ) {
            __typename
            ... on Success {
            message
            }
            ... on Error {
            message
            }
        }
    }
`

export const updateTask = gql`
    mutation(
        $task_id: ID!
        $task_list_id: ID!
    ) {
        updateTask(
            task_id: $task_id
            task_list_id: $task_list_id
        ) {
            __typename
            ... on Success {
            message
            }
            ... on Error {
            message
            }
        }
    }
`