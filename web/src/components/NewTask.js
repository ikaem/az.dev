import { gql } from '@apollo/client';
import React, { useState } from 'react';

import { useStore } from '../store';
import Errors from './Errors';
import { FULL_TASK_FRAGMENT } from './TaskPage';

/** GIA NOTES
 * Define GraphQL operations here...
 */

const TASK_CREATE = gql`
  mutation taskCreate($input: TaskInput!) {
    taskCreate(input: $input) {
      errors {
        message
      }
      task {
        id
      }
    }
  }
`;

const TEST_TASK_CREATE = gql`
  mutation taskCreate($input: TaskInput!) {
    taskCreate(input: $input) {
      errors {
        message
      }
      task {
        id
        ...FullTaskData
      }
    }
  }
  ${FULL_TASK_FRAGMENT}
`;

export default function NewTask() {
  const { useLocalAppState, setLocalAppState, mutate, AppLink } = useStore();
  const [uiErrors, setUIErrors] = useState([]);

  const user = useLocalAppState('user');

  if (!user) {
    return (
      <div className='box'>
        <div className='center'>Please login to create a Task record</div>
      </div>
    );
  }

  const handleNewTaskSubmit = async (event) => {
    event.preventDefault();
    const input = event.target.elements;

    const { data, errors: rootErrors } = await mutate(TASK_CREATE, {
      variables: {
        input: {
          content: input.content.value,
          // this is a cool solution, to immediately convert ot an array - the string
          tags: input.tags.value.split(','),
          isPrivate: input.private.checked,
        },
      },
    });

    // this will only exist if there is errors
    if (rootErrors) return setUIErrors(rootErrors);

    // this is in the data
    // errors will always exist here
    const { errors, task } = data.taskCreate;

    if (errors.length > 0) return setUIErrors(errors);

    setLocalAppState({
      conponent: {
        // this part is cool - there is an object with key value pairs in the store module
        name: 'TaskPage',
        // so here we would set the props to the whole thing
        props: { taskId: task.id },
      },
    });

    /** GIA NOTES
     *
     * 1) Invoke the mutation create a new task:
     *   - input.*.value has what a user types in an input box
     *
     * 2) Use the code below after that. It needs these variables:
     *   - `errors` is an array of objects of type UserError
     *   - `task` is the newly created Task object

      if (errors.length > 0) {
        return setUIErrors(errors);
      }
      setLocalAppState({
        component: { name: 'TaskPage', props: { taskId: task.id } },
      });

    */
  };

  return (
    <div className='main-container'>
      <AppLink to='Home'>{'<'} Cancel</AppLink>
      <div className='box box-primary'>
        <form method='POST' onSubmit={handleNewTaskSubmit}>
          <div className='form-entry'>
            <label>
              CONTENT
              <textarea
                name='content'
                placeholder='Describe the task. Be brief.'
                required
              />
            </label>
          </div>
          <div className='form-entry'>
            <label>
              TAGS
              <input
                type='text'
                name='tags'
                placeholder='Comma-separated words (javascript, git, react, ...)'
                required
              />
            </label>
          </div>

          <div className='form-entry'>
            <label>
              <input type='checkbox' name='private' /> Make this a private entry
              (only for your account)
            </label>
          </div>
          <Errors errors={uiErrors} />
          <div className='spaced'>
            <button className='btn btn-primary' type='submit'>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
