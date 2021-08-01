// api\src\schema\types.js
import { GraphQLObjectType, GraphQLNonNull, GraphQLInt } from 'graphql';

export const NumbersInRange = new GraphQLObjectType({
  name: 'NumbersInRange',
  description: 'Aggrefate info on a range of numbers',
  fields: {
    sum: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    count: {
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
});
