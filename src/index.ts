import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const server = new ApolloServer({
  // typeDef -- definitions of typws of data
  // resolvers (how to respond to queries with different data)
});

const { url } = await startStandaloneServer(server, {
  listen: {
    port: 4000,
  },
});

console.log('Server ready at port', 4000);
