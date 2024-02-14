// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
// graphql types: Int, Float, String, Boolean, ID
// https://graphql.org/graphql-js/basic-types/
export const typeDefs = `#graphql
  type Game {
    id: ID!
    title: String!
    platform: [String!]!
  }
  type Review {
    id: ID!
    rating: Int!
    content: String!
  }
  type Author {
    id: ID!
    name: String!
    verified: Boolean!
  }
  # must to have
  type Query {
    reviews:[Review]
    games:[Game]
    authors:[Author]
  }
`;
