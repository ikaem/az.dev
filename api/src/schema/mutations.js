// api\src\schema\mutations.js

import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import AuthInput from './types/input-auth';
import TaskInput from './types/input-task';
import UserInput from './types/input-user';
import TaskPayload from './types/payload-task';
import UserPayload from './types/payload-user';

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    taskCreate: {
      type: TaskPayload,
      args: {
        input: {
          type: new GraphQLNonNull(TaskInput),
        },
      },
      resolve: async (source, { input }, { mutators, currentUser }) => {
        // this needs to be implemented still
        return mutators.taskCreate({ input, currentUser });
      },
    },
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
