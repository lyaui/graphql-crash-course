import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// import db from './db';
// import { typeDefs } from './schema';

// 在此設定資料的關聯，related data
const typeDefs = `#graphql
  type Game {
    id: ID!
    title: String!
    platform: [String!]!
    reviews: [Review!] # 可以是 [] 但不能是 [{}]
  }
  type Review {
    id: ID!
    rating: Int!
    content: String!
    game: Game!
    author: Author!
  }
  type Author {
    id: ID!
    name: String!
    verified: Boolean!
    reviews: [Review!]
  }
  # must to have
  type Query {
    reviews:[Review]
    review(id: ID!): Review
    games:[Game]
    game(id: ID!): Game
    authors:[Author]
    author(id: ID!): Author
  }
  type Mutation {
    addGame(game: AddGameInput!): Game
    deleteGame(id: ID!): [Game!]
  }
  # input https:graphql.org/graphql-js/mutations-and-input-types/
  input AddGameInput {
    title: String
    platform: [String!]!
  }
`;

let games = [
  { id: '1', title: 'Zelda, Tears of the Kingdom', platform: ['Switch'] },
  { id: '2', title: 'Final Fantasy 7 Remake', platform: ['PS5', 'Xbox'] },
  { id: '3', title: 'Elden Ring', platform: ['PS5', 'Xbox', 'PC'] },
  { id: '4', title: 'Mario Kart', platform: ['Switch'] },
  { id: '5', title: 'Pokemon Scarlet', platform: ['PS5', 'Xbox', 'PC'] },
];

let authors = [
  { id: '1', name: 'mario', verified: true },
  { id: '2', name: 'yoshi', verified: false },
  { id: '3', name: 'peach', verified: true },
];

let reviews = [
  { id: '1', rating: 9, content: 'lorem ipsum', author_id: '1', game_id: '2' },
  { id: '2', rating: 10, content: 'lorem ipsum', author_id: '2', game_id: '1' },
  { id: '3', rating: 7, content: 'lorem ipsum', author_id: '3', game_id: '3' },
  { id: '4', rating: 5, content: 'lorem ipsum', author_id: '2', game_id: '4' },
  { id: '5', rating: 8, content: 'lorem ipsum', author_id: '2', game_id: '5' },
  { id: '6', rating: 7, content: 'lorem ipsum', author_id: '1', game_id: '2' },
  { id: '7', rating: 10, content: 'lorem ipsum', author_id: '3', game_id: '1' },
];

const db = { games, authors, reviews };

const resolvers = {
  Query: {
    games() {
      return db.games;
    },
    game(parent, args, context) {
      return db.games.find((_game) => _game.id === args.id);
    },
    reviews() {
      return db.reviews;
    },
    review(parent, args, context) {
      return db.reviews.find((_review) => _review.id === args.id);
    },
    authors() {
      return db.authors;
    },
    author(parent, args, context) {
      return db.authors.find((_author) => _author.id === args.id);
    },
  },
  // related data
  Game: {
    reviews(parent) {
      // parent 指的是 Game
      return db.reviews.filter((_review) => _review.game_id === parent.id);
    },
  },
  Author: {
    reviews(parent) {
      return db.reviews.filter((_review) => _review.author_id === parent.id);
    },
  },
  Review: {
    game(parent) {
      return db.games.find((_game) => _game.id === parent.game_id);
    },
    author(parent) {
      return db.authors.find((_author) => _author.id === parent.author_id);
    },
  },
  Mutation: {
    addGame(_, args) {
      const game = {
        ...args.game,
        id: Math.floor(Math.random() * 1000).toString(),
      };
      db.games.push(game);
      return game;
    },
    deleteGame(_, args) {
      db.games = db.games.filter((_game) => _game.id !== args.id);
      return db.games;
    },
  },
};

const server = new ApolloServer({
  // typeDef -- definitions of typws of data
  typeDefs,
  // resolvers (how to respond to queries with different data)
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: {
    port: 4000,
  },
});

console.log('Server ready at port', 4000);
