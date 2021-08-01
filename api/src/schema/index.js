// api\src\schema\index.js

import {
  //   buildSchema,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLInputObjectType,
} from 'graphql';

import { NumbersInRange } from './types';
import { numbersInRangeObject } from '../utils';

// defining new object type

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    currentTime: {
      type: GraphQLString,
      resolve: () => {
        const isoString = new Date().toISOString();
        return isoString.slice(11, 19);
      },
    },

    numbersInRange: {
      //   type: new GraphQLNonNull(GraphQLInt),
      type: NumbersInRange,
      args: {
        begin: { type: new GraphQLNonNull(GraphQLInt) },
        end: { type: new GraphQLNonNull(GraphQLInt) },

        // input: new GraphQLInputObjectType({
        //   name: 'SumNumbersInRangeInput',
        //   fields: {
        //     begin: { type: new GraphQLNonNull(GraphQLInt) },
        //     end: { type: new GraphQLNonNull(GraphQLInt) },
        //   },
        // }),
      },
      resolve: function (source, { begin, end }) {
        // console.log({ source });
        // let sum = 0;
        // for (let i = begin; i <= end; i++) {
        //   sum += i;
        // }

        // return sum;

        return numbersInRangeObject(begin, end);
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: QueryType,
});

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
