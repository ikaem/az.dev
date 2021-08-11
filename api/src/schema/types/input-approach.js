// api\src\schema\types\input-approach.js

import {
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import ApproachDetailInput from './input-approach-detail';

const ApproachInput = new GraphQLInputObjectType({
  name: 'ApproachInput',
  fields: () => ({
    content: {
      type: new GraphQLNonNull(GraphQLString),
    },
    detailList: {
      type: new GraphQLNonNull(
        new GraphQLList(new GraphQLNonNull(ApproachDetailInput))
      ),
    },
  }),
});

export default ApproachInput;
