import {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { extractPrefixedColumns } from '../../utils';
import Approach from './approach';
import SearchResultItem from './search-result-item';
import User from './user';

export const Task = new GraphQLObjectType({
  name: 'Task',
  interfaces: () => [SearchResultItem],
  // isTypeOf: (source, context, info) => {
  //   console.log({ source, context, info });
  //   if (source.type === 'task') return true;
  // },
  fields: {
    approachList: {
      type: new GraphQLNonNull(
        // we still need the Approach type
        new GraphQLList(new GraphQLNonNull(Approach))
      ),
      // resolve: (source, args, { pgApi }) => {
      resolve: (source, args, { loaders }) => {
        return loaders.approachList.load(source.id);
        // return pgApi.approachList(source.id);
      },
    },
    id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    tags: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(GraphQLString))
      ),
      resolve: (source) => source.tags.split(','),
    },
    approachCount: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      //   this will now be renamed to createdAt
      //   resolve: (source) => source.created_at,
      //   how come no use of new Date()?. Because the type is already a full date?
      resolve: (source) => source.createdAt.toISOString(),
    },
    userId: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    isPrivate: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    author: {
      type: new GraphQLNonNull(User),
      // we dont need to fetch data anymoe - we already have it fetcvhed by the parent / source
      // we just have to transform it, and return what we transform
      // resolve: (source, args, { pgApi }) => {
      resolve: (source, args, { loaders }) => {
        // resolve: (prefixedObject) => {
        // return pgApi.userInfo(source.userId);
        // so here we pass just one id
        // but this will be batched into a single sql statement
        return loaders.users.load(source.userId);
        // return extractPrefixedColumns({ prefixedObject, prefix: 'author' });
      },
    },
  },
});
