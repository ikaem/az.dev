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

// import { useStoreObject, Provider as StoreProvider } from './store';
import Root from './components/Root';
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';

import * as config from './config';
import { setContext } from '@apollo/client/link/context';
import { LOCAL_APP_STATE } from './store';

const httpLink = new HttpLink({ uri: config.GRAPHQL_SERVER_URL });
const cache = new InMemoryCache();
const client = new ApolloClient({ cache });
const authLink = setContext((_, { headers }) => {
  const { user } = client.readQuery({
    // const { user } = cache.readQuery({
    query: LOCAL_APP_STATE,
  });

  console.log({ user });

  return {
    headers: {
      ...headers,
      authorization: user ? `Bearer ${user.authToken}` : '',
    },
  };
});

client.setLink(authLink.concat(httpLink));
// const client = new ApolloClient({ link: authLink.concat(httpLink), cache });

const initialLocalAppState = {
  component: { name: 'Home', props: {} },
  user: JSON.parse(window.localStorage.getItem('azdev:user')),
};

client.writeQuery({
  query: LOCAL_APP_STATE,
  data: initialLocalAppState,
});

export default function App() {
  // const store = useStoreObject();
  return (
    // <ApolloProvider client={store.client}>
    <ApolloProvider client={client}>
      {/* <StoreProvider value={store}> */}
      <Root />

      <h1>Hello</h1>
      {/* </StoreProvider> */}
    </ApolloProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
