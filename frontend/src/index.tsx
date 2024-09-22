import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MemoryLane from './components/memoryLane';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";


const client = new ApolloClient({
  link: createUploadLink({
    uri : process.env.REACT_APP_GRAPHQL_ENDPOINT ||  "http://127.0.0.1:8000/graphql"
  }),
  cache: new InMemoryCache()
})
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/memoryLane" element={<MemoryLane/>} />
      </Routes>
    </Router>
    </ApolloProvider>
  </React.StrictMode>
);



