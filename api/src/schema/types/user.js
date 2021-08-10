import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Task } from './task';

const fieldsWrapper = ({ meScope }) => {
  const userFields = {
    id: { type: new GraphQLNonNull(GraphQLID) },
    username: { type: GraphQLString },
    name: {
      type: GraphQLString,
      // this first name and last name will come from the parent
      //   and then we make them an arry, and filter to find true values
      // then we join it based on empty space
      // if empty array, we will just get back an empty string, because empty space
      resolve: ({ firstName, lastName }) =>
        [firstName, lastName].filter(Boolean).join(' '),
    },
  };

  if (meScope) {
    userFields.taskList = {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(Task))),
      resolve: (source, args, { loaders, currentUser }) => {
        // this needs to be implemented still
        return loaders.tasksForUsers.load(currentUser.id);
      },
    };
  }

  return userFields;
};

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => fieldsWrapper({ meScope: false }),
  // fields: {
  //   id: { type: new GraphQLNonNull(GraphQLID) },
  //   username: { type: GraphQLString },
  //   name: {
  //     type: GraphQLString,
  //     // this first name and last name will come from the parent
  //     //   and then we make them an arry, and filter to find true values
  //     // then we join it based on empty space
  //     // if empty array, we will just get back an empty string, because empty space
  //     resolve: ({ firstName, lastName }) =>
  //       [firstName, lastName].filter(Boolean).join(' '),
  //   },
  // },
});

export const Me = new GraphQLObjectType({
  name: 'Me',
  fields: () => fieldsWrapper({ meScope: true }),
});

export default User;
