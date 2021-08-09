// api\src\schema\index.js

import {
  //   buildSchema,
  GraphQLSchema,
  printSchema,
} from 'graphql';

import QueryType from './queries';
import MutationType from './mutations';

// defining new object type

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
/* 
type Query {
  currentTime: String
  numbersInRange(begin: Int!, end: Int!): NumbersInRange
}

"""Aggrefate info on a range of numbers"""
type NumbersInRange {
  sum: Int!
  count: Int!
}
*/

// export const schema = buildSchema(`
//     type Query {
//         currentTime: String!
//     }
// `);

// export const rootValue = {
//   currentTime: () => {
//     const isoString = new Date().toISOString();
//     return isoString.slice(11, 19);
//   },
// };
