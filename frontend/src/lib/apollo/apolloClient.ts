import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// HTTP connection to the API - Remove /graphql from the URI
const httpLink = createHttpLink({
  uri: "http://localhost:8383", // Apollo Server standalone serves at root path
  fetchOptions: {
    mode: "cors",
  },
});

// Middleware to add the authorization token to every request
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem("authToken");
  
  console.log("Apollo Client - Token from localStorage:", token ? "Present" : "Not found");

  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };
});

// Create Apollo Client
const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  // Remove the duplicate headers here - authLink handles this
  defaultOptions: {
    watchQuery: {
      errorPolicy: "all",
    },
    query: {
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});

export default apolloClient;