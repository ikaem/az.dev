import { gql } from '@apollo/client';
import React, { useState, useEffect } from 'react';

import { useStore } from '../store';
import TaskSummary, { TASK_SUMMARY_FRAGMENT } from './TaskSummary';

/** GIA NOTES
 * Define GraphQL operations here...
 */

const MY_TASK_LIST = gql`
  query myTaskList {
    me {
      taskList {
        id
        ...TaskSummary
      }
    }
  }
  ${TASK_SUMMARY_FRAGMENT}
`;

export default function MyTasks() {
  const { query } = useStore();
  const [myTaskList, setMyTaskList] = useState(null);

  useEffect(() => {
    query(MY_TASK_LIST).then(({ data }) => {
      console.log({ data });
      setMyTaskList(data.me.taskList);
    });
    /** GIA NOTES
     *
     *  1) Invoke the query to get current user list of Tasks
     *     (You can't use `await` here but `promise.then` is okay)
     *
     *  2) Use the line below on the returned data:

      setMyTaskList(API_RESP_FOR_userTaskList);

     */
  }, [query]);

  if (!myTaskList) {
    return <div className='loading'>Loading...</div>;
  }

  return (
    <div>
      <div>
        <h1>My Tasks</h1>
        {myTaskList.length === 0 && (
          <div className='box box-primary'>
            You have not created any Task entries yet
          </div>
        )}
        {myTaskList.map((task) => (
          <TaskSummary key={task.id} task={task} link={true} />
        ))}
      </div>
    </div>
  );
}
