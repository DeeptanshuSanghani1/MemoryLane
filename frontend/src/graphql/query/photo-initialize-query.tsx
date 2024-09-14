import { gql } from "@apollo/client";
import { graphql } from "graphql";


export const FETCH_IMAGE_URL = gql`
query{
    allImages
}`