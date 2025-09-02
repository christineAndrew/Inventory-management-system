
export const environment = {
  graphqlUri: import.meta.env.VITE_GRAPHQL_URI || 'http://localhost:8000',
};

export const ENDPOINT = environment.graphqlUri;