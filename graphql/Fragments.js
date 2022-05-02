// global usage

import gql from 'graphql-tag'

export const message = gql`
    fragment ResponseMessage on Message {
        __typename
        ... on LoginPayload {
            access_token
            expires_in
        }
        __typename
        ... on Error {
            message
        }
    }
`