import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "http://localhost:8082/graphql", // Assure-toi que l'URL correspond à ton backend GraphQL
  }),
  cache: new InMemoryCache(),
});

export default client;
