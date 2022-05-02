import gql from 'graphql-tag'
import { message } from './Fragments';

export const login = gql`
    mutation(
        $email: String!
        $password: String!
    ) {
        login (
            email: $email
            password: $password
        ) {
            ...ResponseMessage
        }
    }
    ${message}
`

export const register = gql`
    mutation(
        $email: String!
        $username: String!
        $password: String!
    ) {
        createUser(input: {
            email: $email
            username: $username
            password: $password
        }) {
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