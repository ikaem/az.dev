// api\src\schema\types\approach.js

import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import ApproachDetail from './approach-detail';
import SearchResultItem from './search-result-item';
import { Task } from './task';
import User from './user';

const Approach = new GraphQLObjectType({
  name: 'Approach',
  interfaces: () => [SearchResultItem],
  //   isTypeOf: (source, context, info) => info.type === 'approach',
  //   isTypeOf: (source, context, info) => {
  //     console.log({ source, context, info });
  //     if (source.type === 'approach') return true;
  //   },
  //   isTypeOf: () => 'task',
  fields: () => ({
    detailList: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(ApproachDetail))
      ),
      resolve: (source, args, { loaders }) => {
        console.log({ source });
        return loaders.detailList.load(source.id);
      },
    },
    id: { type: new GraphQLNonNull(GraphQLID) },
    taskId: { type: new GraphQLNonNull(GraphQLID) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    voteCount: { type: new GraphQLNonNull(GraphQLInt) },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      resolve: ({ createdAt }) => createdAt.toISOString(),
    },
    author: {
      type: new GraphQLNonNull(User),
      //   resolve: (source, args, { pgApi }) => {
      resolve: (source, args, { loaders }) => {
        // return pgApi.userInfo(source.userId);
        console.log('sourceeeeeeeeee', source);
        return loaders.users.load(source.userId);
      },
    },
    task: {
      type: new GraphQLNonNull(Task),
      resolve: (source, args, { loaders }, info) => {
        // this is the problem - because task will call aporaoch, and so on
        console.log({ info });
        return loaders.tasks.load(source.taskId);
      },
    },
  }),
});

export default Approach;
