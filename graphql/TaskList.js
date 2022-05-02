import gql from 'graphql-tag'

export const fetchTaskLists = gql`
    query($user_id: ID!) {
        taskLists(user_id: $user_id) {
            id
            name
            tasks {
                id
                description
            }
        }
    }
`

export const createTaskList = gql`
    mutation(
        $name: String!
        $user_id: ID!
    ) {
        createTaskList(
            user_id: $user_id
            name: $name
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