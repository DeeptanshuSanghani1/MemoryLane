import { gql } from "@apollo/client"

export const SIGNUP_MUTATION = gql`
    mutation Signup($input : AuthUser!) {
      signup(input: $input) {
        success
        message
      }
    }`;


export const LOGIN_MUTATION = gql`
    mutation Login($input: AuthUser!) {
      login(input: $input) {
        user {
          username
        }
        accessToken
        tokenType
      }
    }
  `;