// api\src\schema\mutations.js

import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import AuthInput from './types/input-auth';
import UserInput from './types/input-user';
import UserPayload from './types/payload-user';

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    userLogin: {
      type: new GraphQLNonNull(UserPayload),
      args: {
        input: { type: new GraphQLNonNull(AuthInput) },
      },
      resolve: async (source, { input }, { mutators }) => {
        //   this needs to be created
        return mutators.userLogin({ input });
      },
    },
    userCreate: {
      type: new GraphQLNonNull(UserPayload),
      args: {
        input: { type: new GraphQLNonNull(UserInput) },
      },
      resolve: async (source, { input }, { mutators }) => {
        //   this method does not exist yet on the mutators object
        console.log({ mutators }, { input });
        return mutators.userCreate({ input });
      },
    },
  }),
});

export default MutationType;
