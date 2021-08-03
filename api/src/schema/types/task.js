import {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

export const Task = new GraphQLObjectType({
  name: 'Task',
  fields: {
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
  },
});
