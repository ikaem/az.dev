// api\src\schema\types\search-result-item.js

import {
  GraphQLID,
  GraphQLInterfaceType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Approach from './approach';
import { Task } from './task';

const SearchResultItem = new GraphQLInterfaceType({
  name: 'SearchResultItem',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLID) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
  resolveType: (obj) => {
    if (obj.type === 'task') return Task;
    if (obj.type === 'approach') return Approach;
  },
});

export default SearchResultItem;
