import { gql } from "@apollo/client";
import { graphql } from "graphql";


export const FETCH_IMAGE_URLS = gql`
  query FetchAllImages($username: String!) {
    allImages(username: $username)
  }
`;