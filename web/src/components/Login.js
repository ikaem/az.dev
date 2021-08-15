import { gql, useMutation } from '@apollo/client';
import React, { useState } from 'react';

import { useStore } from '../store';
import Errors from './Errors';

/** GIA NOTES
 * Define GraphQL operations here...
 */

// we define input as being AuhtInput type here
// how do we know this on frontend? by using GraphiQL
const USER_LOGIN = gql`
  mutation UserLogin($input: AuthInput!) {
    userLogin(input: $input) {
      errors {
        message
      }
      user {
        id
        username
      }
      authToken
    }
  }
`;

export default function Login() {
  const { mutate, setLocalAppState } = useStore();

  const [loginUser, { error, loading }] = useMutation(USER_LOGIN, {
    errorPolicy: 'all',
  });

  console.log(error.networkError);

  const [uiErrors, setUIErrors] = useState();

  // this error is some error that might happen when start mutation
  if (error) return <div className='error'>{error.message}</div>;

  const handleLogin = async (event) => {
    event.preventDefault();
    const input = event.target.elements;

    // const { data } = await mutate(USER_LOGIN, {
    const { data, errors: rootErrors } = await loginUser(USER_LOGIN, {
      variables: {
        input: {
          username: input.username.value,
          password: input.password.value,
        },
      },
    });

    // this error might happen on the root - some sql issue
    if (rootErrors) {
      return setUIErrors(rootErrors);
    }
    // and this error might be returned as part of the response - bad password or something
    const { errors, user, authToken } = data.userLogin;

    if (errors.length > 0) return setUIErrors(errors);

    user.authToken = authToken;
    window.localStorage.setItem('azdev:user', JSON.stringify(user));
    // this sets the user globally
    // it also redirects home
    setLocalAppState({ user, component: { name: 'Home' } });

    /** GIA NOTES
     *
     * 1) Invoke the mutation to authenticate a user:
     *   - input.username.value has what a user types in the username input
     *   - input.password.value has what a user types in the password input
     * 2) Use the code below after that. It needs these variables:
     *   - `errors` is an array of objects of type UserError
     *   - `user` is a user object response from the API
     *   - `authToken` is a string value response from the API

      if (errors.length > 0) {
        return setUIErrors(errors);
      }
      user.authToken = authToken;
      window.localStorage.setItem('azdev:user', JSON.stringify(user));
      setLocalAppState({ user, component: { name: 'Home' } });

    */
  };

  return (
    <div className='sm-container'>
      <form method='POST' onSubmit={handleLogin}>
        <div className='form-entry'>
          <label>
            USERNAME
            <input type='text' name='username' required />
          </label>
        </div>
        <div className='form-entry'>
          <label>
            PASSWORD
            <input type='password' name='password' required />
          </label>
        </div>
        <Errors errors={uiErrors} />
        <div className='spaced'>
          <button className='btn btn-primary' type='submit' disabled={loading}>
            Login {loading && <i className='spinner'>...</i>}
          </button>
        </div>
      </form>
    </div>
  );
}
