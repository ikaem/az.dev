import { gql, useQuery, useMutation } from '@apollo/client';
import React, { useState, useEffect } from 'react';

import { useStore } from '../store';
import { APPROACH_FRAGMENT } from './Approach';
import Errors from './Errors';

/** GIA NOTES
 * Define GraphQL operations here...
 */

const DETAIL_CATEGORIES = gql`
  query getDetailCategories {
    detailCategories: __type(name: "ApproachDetailsCategory") {
      enumValues {
        name
      }
    }
  }
`;

const APPROACH_CREATE = gql`
  mutation ApproachCreate($taskId: ID!, $input: ApproachInput!) {
    approachCreate(taskId: $taskId, input: $input) {
      errors {
        message
      }
      approach {
        id
        ...ApproachFragment
      }
    }
  }
  ${APPROACH_FRAGMENT}
`;

export default function NewApproach({ taskId, onSuccess }) {
  const { useLocalAppState, mutate, query } = useStore();
  // const [detailCategories, setDetailCategories] = useState([]);
  const [detailRows, setDetailRows] = useState([0]);
  const [uiErrors, setUIErrors] = useState([]);
  const user = useLocalAppState('user');

  const {
    error: dcError,
    loading: dcLoading,
    data,
  } = useQuery(DETAIL_CATEGORIES);

  const [createApproach, { error, loading }] = useMutation(APPROACH_CREATE, {
    // this is us using the update function
    // and this is also the data that is available once the data is resolved
    update(cache, { data: { approachCreate } }) {
      // just check that the approach actually exists, before add it to the cached task
      if (approachCreate.approach) {
        // call that onSuccess thing - whic is taht onAddNew Approach ho function
        onSuccess((taskInfo) => {
          cache.modify({
            // we identify the object with the taskInfo
            id: cache.identify(taskInfo),
            fields: {
              // functions ae called same as the fields on the identified object
              approachList(currentList) {
                // then we just concatanage the previous lists with the new list
                return [approachCreate.approach, ...currentList];
              },
            },
          });

          // justreturn that id, so we can highlight it
          return approachCreate.approach.id;
        });
      }
    },
  });

  if (dcLoading) return <div className='loading'>Loading...</div>;
  if (dcError || error)
    return <div className='error'>{(dcError || error).message}</div>;

  // and now we just get data for the etail categiees
  const detailCategories = data.detailCategories.enumValues;

  // useEffect(() => {
  //   if (detailCategories.length === 0) {
  //     query(DETAIL_CATEGORIES).then(({ data }) => {
  //       console.log({ data });
  //       setDetailCategories(data.detailCategories.enumValues);
  //     });

  //     /** GIA NOTES
  //      *
  //      * 1) Invoke the query to get the detail categories:
  //      *    (You can't use `await` here but `promise.then` is okay)
  //      *
  //      * 2) Use the line below on the returned data:

  //       setDetailCategories(API_RESP_FOR_detailCategories);

  //      */
  //   }
  // }, [detailCategories, query]);

  if (!user) {
    return (
      <div className='box'>
        <div className='center'>
          Please login to add a new Approach record to this Task
        </div>
      </div>
    );
  }

  const handleNewApproachSubmit = async (event) => {
    event.preventDefault();
    setUIErrors([]);
    const input = event.target.elements;
    const detailList = detailRows.map((detailId) => ({
      category: input[`detail-category-${detailId}`].value,
      content: input[`detail-content-${detailId}`].value,
    }));

    // const { data, errors: rootErrors } = await mutate(APPROACH_CREATE, {
    const { data, errors: rootErrors } = await createApproach(APPROACH_CREATE, {
      variables: {
        taskId,
        input: {
          content: input.content.value,
          detailList,
        },
      },
    });

    if (rootErrors) return setUIErrors(rootErrors);
    const { errors, approach } = data.approachCreate;

    if (errors.length > 0) return setUIErrors(errors);
    onSuccess(approach);

    /** GIA NOTES
     *
     * 1) Invoke the mutation to create a new approach:
     *   - Variable `taskId` is for the parent Task of this new Approach
     *   - detailList is an array of all the input for the details of this new Approach
     *   - input.*.value has what a user types in an input box
     *
     * 2) Use the code below after that. It needs these variables:
     *   - `errors` is an array of objects of type UserError
     *   - `approach` is the newly created Approach object

      if (errors.length > 0) {
        return setUIErrors(errors);
      }
      onSuccess(approach);

    */
  };

  return (
    <div className='main-container'>
      <div className='box box-primary'>
        <form method='POST' onSubmit={handleNewApproachSubmit}>
          <div className='form-entry'>
            <label>
              APPROACH
              <textarea name='content' placeholder='Be brief!' />
            </label>
          </div>
          <div className='form-entry'>
            <label>
              DETAILS
              {detailRows.map((detailId) => (
                <div key={detailId} className='details-row'>
                  <select name={`detail-category-${detailId}`}>
                    {detailCategories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type='text'
                    name={`detail-content-${detailId}`}
                    placeholder='Be brief!'
                  />
                </div>
              ))}
            </label>
            <button
              type='button'
              className='y-spaced'
              onClick={() => setDetailRows((rows) => [...rows, rows.length])}
            >
              + Add more details
            </button>
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
