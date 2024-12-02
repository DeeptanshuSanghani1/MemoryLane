import { gql } from "@apollo/client";


export const FETCH_IMAGE_URLS = gql`
  query FetchAllImages($username: String!) {
    allImages(username: $username)
  }
`;