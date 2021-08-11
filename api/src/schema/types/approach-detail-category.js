import { GraphQLEnumType } from 'graphql';

// api\src\schema\types\approach-detail-category.js
const ApproachDetailCategory = new GraphQLEnumType({
  name: 'ApproachDetailsCategory',
  values: {
    NOTE: {
      value: 'notes',
    },
    EXPLANATION: {
      value: 'explanations',
    },
    WARNING: {
      value: 'warnings',
    },
  },
});

export default ApproachDetailCategory;
