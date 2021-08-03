// api\src\schema\index.js

import {
  //   buildSchema,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLInputObjectType,
  printSchema,
  GraphQLList,
} from 'graphql';

import { NumbersInRange } from './types';
import { numbersInRangeObject } from '../utils';
import { Task } from './types/task';

// defining new object type

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    taskMainList: {
      type: new GraphQLList(new GraphQLNonNull(Task)),
      resolve: async (source, args, { pgPool }) => {
        const pgResp = await pgPool.query(`
          select 
            id,
            content,
            tags,
            approach_count as "approachCount",
            created_at as "createdAt" 
          from azdev.tasks
          where is_private = false
          order by created_at desc
          limit 100
        `);

        return pgResp.rows;
      },
    },

    currentTime: {
      type: GraphQLString,

      resolve: (source, args, context, info) => {
        // const sleepToDate = new Date(new Date().getTime() + 5000);
        // // as long as sleep to date is bigger than now, just sleep
        // while (sleepToDate > new Date()) {
        //   console.log('sleeping');
        // }

        // this will return the promise
        // we dont need to await this promise, becuase the returned promise will be awaited by the executre, and then use the data
        // this behavior is built into gql.js
        return new Promise((resolve) => {
          setTimeout(() => {
            const isoString = new Date().toISOString();
            // this will resolve after 5 seconds
            resolve(isoString.slice(11, 19));
          }, 5000);
        });
      },
    },

    numbersInRange: {
      //   type: new GraphQLNonNull(GraphQLInt),
      type: NumbersInRange,
      // type: new GraphQLNonNull(NumbersInRange),
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

console.log(printSchema(schema));
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
