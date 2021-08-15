import { gql, useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';

import { useStore } from '../store';
import Search from './Search';
import TaskSummary, { TASK_SUMMARY_FRAGMENT } from './TaskSummary';

/** GIA NOTES
 * Define GraphQL operations here...
 */

const mockTasks = [
  {
    id: 1,
    content: 'Mock content #1',
    author: { username: 'mock-author' },
    tags: ['tag1', 'tag2'],
  },
  {
    id: 2,
    content: 'Mock content #2',
    author: { username: 'mock-author' },
    tags: ['tag1', 'tag2'],
  },
  {
    id: 3,
    content: 'Mock content #3',
    author: { username: 'mock-author' },
    tags: ['tag1', 'tag2'],
  },
];

const TASK_MAIN_LIST = gql`
  query TaskMainList {
    taskMainList {
      id
      ...TaskSummary
    }
  }
  ${TASK_SUMMARY_FRAGMENT}
`;

export default function Home() {
  const { loading, data, error, refetch } = useQuery(TASK_MAIN_LIST, {
    // pollInterval: 1000,
    // fetchPolicy: 'network-only',
  });

  console.log({ data });
  // const { query } = useStore();
  // const [taskList, setTaskList] = useState(null);

  // useEffect(() => {
  //   request('{currentTime}').then(({ data }) => {
  //     console.log('Server time is:', data.currentTime);
  //   });
  // }, []);

  useEffect(() => {
    // query(TASK_MAIN_LIST).then(({ data }) => {
    //   console.log({ data });
    //   setTaskList(data.taskMainList);
    // });
    /** GIA NOTES
     *
     *  1) Invoke the query to get list of latest Tasks
     *     (You can't use `await` here but `promise.then` is okay)
     *
     *  2) Change the setTaskList call below to use the returned data:
     *
     */
    // setTaskList(mockTasks); // TODO: Replace mockTasks with API_RESP_FOR_taskMainList
    // }, [query]);
  }, []);

  // if (!taskList) {
  //   return <div className='loading'>Loading...</div>;
  // }
  if (loading) return <div className='loading'>Loading</div>;
  if (error) return <div className='error'>Error</div>;

  return (
    <div>
      <Search />
      <div>
        <h1>Latest</h1>
        <button onClick={() => refetch()}>Refetch</button>
        {/* {taskList.map((task) => ( */}
        {data.taskMainList.map((task) => (
          <TaskSummary key={task.id} task={task} link={true} />
        ))}
      </div>
    </div>
  );
}
