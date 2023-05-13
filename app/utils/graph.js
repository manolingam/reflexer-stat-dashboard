import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/reflexer-labs/rai-mainnet',
  cache: new InMemoryCache()
});
