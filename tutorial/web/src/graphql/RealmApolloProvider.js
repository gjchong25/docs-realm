import React from "react";
import { useRealmApp } from "../RealmApp";
import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

// Create an ApolloClient that connects to the provided Realm.App's GraphQL API
// :snippet-start: createRealmApolloClient
const createRealmApolloClient = (app) => {
  const link = new HttpLink({
    // Realm apps use a standard GraphQL endpoint, identified by their App ID
    uri: `https://realm.mongodb.com/api/client/v2.0/app/${app.id}/graphql`,
    // A custom fetch handler adds the logged in user's access token to GraphQL requests
    fetch: async (uri, options) => {
      if (!app.currentUser) {
        throw new Error(`Must be logged in to use the GraphQL API`);
      }
      // Refreshing a user's custom data also refreshes their access token
      await app.currentUser.refreshCustomData();
      // :state-start: final
      // The handler adds a bearer token Authorization header to the otherwise unchanged request
      options.headers.Authorization = `Bearer ${app.currentUser.accessToken}`;
      // :state-end: :state-uncomment-start: start
      // // TODO: Include the current user's access token in an Authorization header with
      // // every request.
      // :state-uncomment-end:
      return fetch(uri, options);
    },
  });

  const cache = new InMemoryCache();

  return new ApolloClient({ link, cache });
};
// :snippet-end:

// :snippet-start: realmApolloProvider
export default function RealmApolloProvider({ children }) {
  // :state-start: final
  const app = useRealmApp();
  const [client, setClient] = React.useState(createRealmApolloClient(app));
  React.useEffect(() => {
    setClient(createRealmApolloClient(app));
  }, [app]);
  // :state-end: :state-uncomment-start: start
  // // TODO: Create an ``ApolloClient`` object that connects to your app.
  // :state-uncomment-end:
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
// :snippet-end:
