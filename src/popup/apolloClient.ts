import 'monkeyPatchApollo'
import {ApolloClient, InMemoryCache} from "@apollo/client/core";

export const client = new ApolloClient({
  uri: 'https://gqldev.plus-sub.com',
  cache: new InMemoryCache()
});
