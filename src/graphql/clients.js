import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import ls from "~/utils/Storage";

import {base_url} from "~/consts/const";

const cache = new InMemoryCache({
  addTypename: false
});

let authToken = null;  // Initially null, can be set later.

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      Authorization: authToken ? `Bearer ${authToken}` : "",
    }
  }
});

const gqlHttpLink = new HttpLink({
  uri: base_url+ '/query',
});

export const client = new ApolloClient({
  link: authLink.concat(gqlHttpLink), // Concatenate the auth link and the HTTP link
  cache: cache,
});
export function setAuthToken(token) {
  authToken = token;
}


export function  initClient() {

  // if(token){
  //   setAuthToken(token)
  // }
}
