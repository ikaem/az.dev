import React, { useState } from 'react';

import { useStore } from '../store';
import Errors from './Errors';

/** GIA NOTES
 * Define GraphQL operations here...
 */

// we define input as being AuhtInput type here
// how do we know this on frontend? by using GraphiQL
const USER_LOGIN = `
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
  const { request, setLocalAppState } = useStore();
  const [uiErrors, setUIErrors] = useState();
  const handleLogin = async (event) => {
    event.preventDefault();
    const input = event.target.elements;
    // this is some kind of list of elemnts
    console.log({ input });
    console.log(input[0].value);
    console.log(input.username);

    const { data } = await request(USER_LOGIN, {
      variables: {
        input: {
          username: input.username.value,
          password: input.password.value,
        },
      },
    });

    const { errors, user, authToken } = data.userLogin;

    if (errors.length > 0) {
      return setUIErrors(errors);
    }

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
          <button className='btn btn-primary' type='submit'>
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
