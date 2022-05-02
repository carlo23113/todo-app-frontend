import {
  IntrospectionFragmentMatcher,
  InMemoryCache,
} from "apollo-cache-inmemory";

// import introspectionQueryResultData from "../graphql/introspection.json";

// const fragmentMatcher = new IntrospectionFragmentMatcher({
//   introspectionQueryResultData,
// });

export default function (_context) {
  return {
    httpEndpoint: process.env.BACKEND_API_URL,
    // cache: new InMemoryCache({ fragmentMatcher }),
  };
}