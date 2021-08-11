// api\src\schema\mutations.js

import { GraphQLID, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import ApproachInput from './types/input-approach';
import ApproachVoteInputType from './types/input-approach-vote';
import AuthInput from './types/input-auth';
import TaskInput from './types/input-task';
import UserInput from './types/input-user';
import ApproachPayload from './types/payload-approach';
import TaskPayload from './types/payload-task';
import UserPayload from './types/payload-user';
import UserDeletePayload from './types/payload-user-delete';

const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    userDelete: {
      type: UserDeletePayload,
      resolve: async (souce, args, { currentUser, mutators }) => {
        return mutators.userDelete({ currentUser });
      },
    },
    approachVote: {
      type: ApproachPayload,
      args: {
        approachId: { type: new GraphQLNonNull(GraphQLID) },
        input: { type: new GraphQLNonNull(ApproachVoteInputType) },
      },
      resolve: async (source, { approachId, input }, { mutators }) => {
        return mutators.approachVote({ approachId, input });
      },
    },
    approachCreate: {
      // this is not implemented yet
      type: ApproachPayload,
      args: {
        taskId: { type: new GraphQLNonNull(GraphQLID) },
        // ApproachInput is not implemented yet
        input: { type: new GraphQLNonNull(ApproachInput) },
      },
      resolve: async (source, { taskId, input }, { mutators, currentUser }) => {
        // this function is not implemented yet
        return mutators.approachCreate({
          // taskId: Number(taskId),
          taskId,
          input,
          currentUser,
          // this is us passing the mutators - inside we will have a different mutator to do insert in the mongoDb - just to separate the logic
          mutators,
        });
      },
    },
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
