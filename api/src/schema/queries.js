// api\src\schema\queries.js

import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLID,
} from 'graphql';

import { NumbersInRange } from './types';
import { numbersInRangeObject } from '../utils';
import { Task } from './types/task';
import SearchResultItem from './types/search-result-item';
import User, { Me } from './types/user';

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    me: {
      type: Me,
      resolve: async (source, args, { currentUser }) => {
        return currentUser;
      },
    },
    search: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(SearchResultItem))
      ),
      args: {
        term: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (source, args, { loaders }) => {
        return loaders.searchResults.load(args.term);
      },
    },

    taskInfo: {
      type: Task,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLID),
        },
        // userId: {
        //   type: GraphQLInt,
        // },
      },
      // need user id (can be null) because sql statmeent requires it
      //   resolve: async (source, { id, userId = null }, { pgApi }) => {
      //     return pgApi.taskInfo(id, userId);
      //   },

      resolve: async (source, args, { loaders }) => {
        return loaders.tasks.load(args.id);
      },
    },
    taskMainList: {
      type: new GraphQLList(new GraphQLNonNull(Task)),
      //   resolve: async (source, args, { pgApi }) => {
      resolve: async (source, args, { loaders }) => {
        // this will return a promise, but that is fine - gql will responve it
        // return pgApi.taskMainList();
        return loaders.tasksByTypes.load('latest');
      },
      // resolve: async (source, args, { pgPool }) => {
      //   const pgResp = await pgPool.query(`
      //     select
      //       id,
      //       content,
      //       tags,
      //       approach_count as "approachCount",
      //       created_at as "createdAt"
      //     from azdev.tasks
      //     where is_private = false
      //     order by created_at desc
      //     limit 100
      //   `);

      //   return pgResp.rows;
      // },
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

export default QueryType;
