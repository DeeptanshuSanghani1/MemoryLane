import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MemoryLane from './components/memoryLane';
import { ApolloClient, ApolloProvider, HttpLink, InMemoryCache } from '@apollo/client';
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import TestComponent from './components/tempComponent';
import TestTempComponent from './components/tempComponent';

// const uploadLink = createUploadLink({
//   uri: 'http://127.0.0.1:8000/graphql', // Your GraphQL server URL
// });
const client = new ApolloClient({
  link: createUploadLink({
    uri : "http://127.0.0.1:8000/graphql"
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
        <Route path='/test' element = {<TestTempComponent/>} />
      </Routes>
    </Router>
    </ApolloProvider>
  </React.StrictMode>
);



