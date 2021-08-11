// api\src\schema\types\payload-user-delete.js

import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import UserError from './user-error';

const UserDeletePayload = new GraphQLObjectType({
  name: 'UserDeletePayload',
  fields: () => ({
    errors: {
      type: new GraphQLNonNull(new GraphQLList(UserError)),
    },
    deletedUserId: { type: GraphQLID },
  }),
});

export default UserDeletePayload;
