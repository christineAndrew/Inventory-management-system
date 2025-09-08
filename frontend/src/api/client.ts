import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { ENDPOINT } from '../api/environment';

// Simplified Apollo Client without authentication
const httpLink = createHttpLink({
  uri: ENDPOINT,
  credentials: 'include', // Include cookies for CSRF if needed
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default client;