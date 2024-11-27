import { gql } from "@apollo/client";

export const DELETE_FILE_MUTATION = gql`
  mutation DeletePhoto($fileKey: String!, $username: String!) {
    deletePhoto(fileKey: $fileKey, username: $username) {
      success
      message
    }
  }
`;
