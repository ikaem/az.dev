import React, { useState } from 'react';
import fetch from 'cross-fetch';

import * as config from './config';

import {
  ApolloClient,
  gql,
  HttpLink,
  InMemoryCache,
  useApolloClient,
  useQuery,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

export const LOCAL_APP_STATE = gql`
  query localAppState {
    component @client {
      name
      props
    }
    user @client {
      username
      authToken
    }
  }
`;

const httpLink = new HttpLink({ uri: config.GRAPHQL_SERVER_URL });
const cache = new InMemoryCache();
// const client = new ApolloClient({ link: httpLink, cache });
const client = new ApolloClient({ cache });

// const { user } = cache.readQuery({ query: LOCAL_APP_STATE });
// cache.writeQuery({
//   query: LOCAL_APP_STATE,
//   data: { ...authToken.currentState, ...newState },
// });

const initialLocalAppState = {
  component: { name: 'Home', props: {} },
  user: JSON.parse(window.localStorage.getItem('azdev:user')),
};

// The useStoreObject is a custom hook function designed
// to be used with React's context feature
// export const useStoreObject = () => {
export const useStore = () => {
  const client = useApolloClient();

  // we pass it new state object
  const setLocalAppState = (newState) => {
    if (newState.component)
      newState.component.props = newState.component.props ?? {};

    // just store current state to be used later after reset, for intance
    const currentState = client.readQuery({
      query: LOCAL_APP_STATE,
    });

    // just function that will use the current state to set new state
    const updateState = () => {
      client.writeQuery({
        query: LOCAL_APP_STATE,
        data: { ...currentState, ...newState },
      });
    };

    if (newState.user || newState.user === null) {
      // this is some kinf of event listener
      client.onResetStore(updateState);
      client.resetStore();
    } else {
      updateState();
    }
  };
  // This state object is used to manage
  // all local app state elements (like user/component)
  // const [state, setState] = useState(() => initialLocalAppState);
  // const authLink = setContext((_, { headers }) => {
  //   return {
  //     headers: {
  //       ...headers,
  //       authorization: state.user ? `Bearer ${state.user.authToken}` : '',
  //     },
  //   };
  // });
  // client.setLink(authLink.concat(httpLink));

  // const query = async (query, { variables } = {}) => {
  //   const resp = await client.query({ query, variables });
  //   return resp;
  // };

  // const mutate = async (mutation, { variables } = {}) => {
  //   const resp = await client.mutate({ mutation, variables });
  //   return resp;
  // };
  // This function can be used with 1 or more
  // state elements. For example:
  // const user = useLocalAppState('user');
  // const [component, user] = useLocalAppState('component', 'user');
  // this ... just turns whatever we pass into an array - just adds it in - it will spread it, but place it into an array
  // this is like a right side of an operaiton
  const useLocalAppState = (...stateMapper) => {
    const { data } = useQuery(LOCAL_APP_STATE);
    if (stateMapper.length === 1) {
      return data[stateMapper[0]];
    }

    return stateMapper.map((element) => data[element]);
    // if (stateMapper.length === 1) {
    //   return state[stateMapper[0]];
    // }
    // return stateMapper.map((element) => state[element]);
  };

  // This function shallow-merges a newState object
  // with the current local app state object
  // const setLocalAppState = (newState) => {
  //   if (newState.component) {
  //     newState.component.props = newState.component.props ?? {};
  //   }
  //   setState((currentState) => {
  //     return { ...currentState, ...newState };
  //   });

  //   // this would basically remove all cached stuff whenever we change page?
  //   if (newState.user || newState.user === null) {
  //     client.resetStore();
  //   }
  // };

  // This is a component that can be used in place of
  // HTML anchor elements to navigate between pages
  // in the single-page app. The `to` prop is expected to be
  // a React component (like `Home` or `TaskPage`)
  const AppLink = ({ children, to, ...props }) => {
    const handleClick = (event) => {
      event.preventDefault();
      setLocalAppState({
        component: { name: to, props },
      });
    };
    return (
      <a href={to} onClick={handleClick}>
        {children}
      </a>
    );
  };

  // This function should make an ajax call to GraphQL server
  // and return the GraphQL response object
  const request = async (requestText, { variables } = {}) => {
    const headers = state.user
      ? { Authorization: 'Bearer ' + state.user.authToken }
      : {};

    const gsResp = await fetch(config.GRAPHQL_SERVER_URL, {
      method: 'post',
      headers: { ...headers, 'Content-Type': 'application/json' },
      // body is the most imporant part
      // needs to be stringified
      body: JSON.stringify({
        // note the variables coming in here, if there is any
        query: requestText,
        variables,
      }),
    }).then((response) => response.json());

    return gsResp;

    /** GIA NOTES
     *
     * Make an Ajax call here to config.GRAPHQL_SERVER_URL
     * Pass both requestText and variables as body params
     *
     */
  };

  // In React components, the following is the object you get
  // when you make a useStore() call
  return {
    useLocalAppState,
    setLocalAppState,
    AppLink,
    // request,
    // query,
    // mutate,
    client,
  };
};

// Define React's context object and the useStore
// custom hook function that'll use it
const AZContext = React.createContext();
export const Provider = AZContext.Provider;
// export const useStore = () => React.useContext(AZContext);
