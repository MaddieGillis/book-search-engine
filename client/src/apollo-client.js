import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const httpLink = createHttpLink({
  uri: process.env.NODE_ENV === 'production' ? '/graphql' : 'http://localhost:3001/graphql',
});

export const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache()
});

export default client;

