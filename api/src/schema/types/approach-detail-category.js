import { GraphQLEnumType } from 'graphql';

// api\src\schema\types\approach-detail-category.js
const ApproachDetailCategory = new GraphQLEnumType({
  name: 'ApproachDetailsCategory',
  values: {
    NOTE: {},
    EXPLANATION: {},
    WARNING: {},
  },
});

export default ApproachDetailCategory;
