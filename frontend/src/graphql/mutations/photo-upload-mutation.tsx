import { gql } from "@apollo/client";

export const UPLOAD_FILE_MUTATION = gql`
  mutation ReadFile($file: Upload!, $username: String!) {
    readFile(file: $file, username: $username) {
      success
      message
      url
    }
  }
`;