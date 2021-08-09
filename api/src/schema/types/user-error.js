// api\src\schema\types\user-error.js

import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

const UserError = new GraphQLObjectType({
  name: 'UserError',
  fields: () => ({
    message: {
      type: new GraphQLNonNull(GraphQLString),
    },
  }),
});

export default UserError;
