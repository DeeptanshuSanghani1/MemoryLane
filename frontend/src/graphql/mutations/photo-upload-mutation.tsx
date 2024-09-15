import { gql } from "@apollo/client";

export const UPLOAD_FILE_MUTATION = gql `
mutation ReadFile($file : Upload!){
readFile(file: $file){
    url}
}`;
