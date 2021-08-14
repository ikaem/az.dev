// import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
// import 'regenerator-runtime/runtime';

// import * as config from './config';

// const cache = new InMemoryCache();
// const httpLink = new HttpLink({
//   uri: config.GRAPHQL_SERVER_URL,
// });
// const client = new ApolloClient({
//   cache,
//   link: httpLink,
// });

// async function main() {
//   const resp1 = await client.query({
//     // query: gql`
//     //   query {
//     //     numbersInRange(begin: 1, end: 100) {
//     //       sum
//     //     }
//     //   }
//     // `,
//     query: gql`
//       {
//         taskMainList {
//           id
//           content
//           tags
//           createdAt
//         }
//       }
//     `,
//   });

//   console.log({ respData: resp1.data });

//   const resp2 = await client.query({
//     // query: gql`
//     //   query {
//     //     numbersInRange(begin: 1, end: 100) {
//     //       sum
//     //     }
//     //   }
//     // `,

//     query: gql`
//       {
//         taskMainList {
//           content
//         }
//       }
//     `,
//   });

//   console.log({ respData: resp2.data });

//   const resp3 = await client.mutate({
//     mutation: gql`
//       mutation ApproachVote($approachId: ID!) {
//         approachVote(approachId: $approachId, input: { up: true }) {
//           approach {
//             id
//             voteCount
//           }
//         }
//       }
//     `,
//     // ntoe the string as an id - because it is ID, i guess
//     variables: { approachId: '2' },
//   });

//   console.log({ resp3 });
// }

// main();

import 'regenerator-runtime/runtime';
import React from 'react';
import ReactDOM from 'react-dom';

import { useStoreObject, Provider as StoreProvider } from './store';
import Root from './components/Root';
import { ApolloProvider } from '@apollo/client';

export default function App() {
  const store = useStoreObject();
  return (
    <ApolloProvider client={store.client}>
      <StoreProvider value={store}>
        <Root />
      </StoreProvider>
    </ApolloProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
