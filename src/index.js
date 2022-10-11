import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Graphql and urql import
import { createClient, Provider, defaultExchanges, subscriptionExchange } from 'urql';
import { createClient as createWSClient } from 'graphql-ws';

// Our components
import Root from "./routes/root";

// Basic stylesheet
import './index.css';

// Environment variables (replace these variables by dotenv or webpack for a better standard)
import { GRAPHQL_ENDPOINT, GRAPHQL_WS_ENDPOINT } from './config';

// GraphQL client for websocket subscription
const wsClient = createWSClient({
  fetchOptions: () => ({
    credentials: 'include',
  }),
  url: GRAPHQL_WS_ENDPOINT,
});

// GraphQL client for standard Graphql requests
const client = createClient({
  fetchOptions: () => ({
    credentials: 'include',
  }),
  url: GRAPHQL_ENDPOINT,
  exchanges: [
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: (operation) => ({
        subscribe: (sink) => ({
          unsubscribe: wsClient.subscribe(operation, sink),
        }),
      }),
    }),
  ],
});

// Basic router that lead to our chat
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider value={client}>
    <RouterProvider router={router} />
  </Provider>
);


