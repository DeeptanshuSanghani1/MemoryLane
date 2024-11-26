import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import "./index.css";
import App from "./App";

// Apollo Client Setup
const client = new ApolloClient({
  link: createUploadLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT, // Ensure this environment variable is set in .env
  }),
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
