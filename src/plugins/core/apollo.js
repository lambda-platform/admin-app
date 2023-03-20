import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core'
import { createApolloProvider } from '@vue/apollo-option'

import { base_url } from '~/consts/const'
const httpLink = new HttpLink({
  uri: base_url+"/query",
});

// Cache implementation
const cache = new InMemoryCache({
  addTypename: false
});

const apolloClient = new ApolloClient({
  link: httpLink,
  cache: cache,
});

export default createApolloProvider({
  defaultClient: apolloClient,
});
