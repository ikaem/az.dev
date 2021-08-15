import React, { useState, useEffect } from 'react';

import { useStore } from '../store';
import NewApproach from './NewApproach';
import Approach, { APPROACH_FRAGMENT } from './Approach';
import TaskSummary, { TASK_SUMMARY_FRAGMENT } from './TaskSummary';
import {
  disableExperimentalFragmentVariables,
  gql,
  useQuery,
} from '@apollo/client';

/** GIA NOTES
 * Define GraphQL operations here...
 */

export const FULL_TASK_FRAGMENT = gql`
  fragment FullTaskData on Task {
    id
    ...TaskSummary
    approachList {
      id
      ...ApproachFragment
    }
  }
  ${TASK_SUMMARY_FRAGMENT}
  ${APPROACH_FRAGMENT}
`;

const TEST_TASK_INFO = gql`
  query taskInfo($taskId: ID!) {
    taskInfo(id: $taskId) {
      ...fullTaskData
    }
  }
  ${FULL_TASK_FRAGMENT}
`;

const TASK_INFO = gql`
  query TaskInfo($taskId: ID!) {
    taskInfo(id: $taskId) {
      id
      ...TaskSummary
      approachList {
        id
        ...ApproachFragment
      }
    }
  }
  ${TASK_SUMMARY_FRAGMENT}
  ${APPROACH_FRAGMENT}
`;

const mockTaskInfo = {
  id: 42,
  content: 'Mock Task content',
  author: { username: 'mock-author' },
  tags: ['tag1', 'tag2'],
  approachList: [
    {
      id: 42,
      content: 'Mock Approach content',
      author: { username: 'mock-author' },
      voteCount: 0,
      detailList: [
        {
          content: 'Mock note...',
          category: 'NOTE',
        },
      ],
    },
  ],
};

export default function TaskPage({ taskId }) {
  const { query, AppLink } = useStore();
  // const [taskInfo, setTaskInfo] = useState(null);
  const [showAddApproach, setShowAddApproach] = useState(false);
  const [highlightedApproachId, setHighlightedApproachId] = useState();

  const { error, loading, data } = useQuery(TASK_INFO, {
    variables: { taskId },
  });

  if (error) return <div className='error'>{error.message}</div>;
  if (loading) return <div className='loading'>Loading...</div>;

  const { taskInfo } = data;

  // useEffect(() => {
  //   if (!taskInfo) {
  //     query(TASK_INFO, { variables: { taskId } }).then(({ data }) => {
  //       setTaskInfo(data.taskInfo);
  //     });

  //     /** GIA NOTES
  //      *
  //      *  1) Invoke the query to get the information of a Task object:
  //      *     (You can't use `await` here but `promise.then` is okay)
  //      *
  //      *  2) Change the line below to use the returned data instead of mockTaskInfo:
  //      *
  //      */
  //     // setTaskInfo(mockTaskInfo); // TODO: Replace mockTaskInfo with API_RESP_FOR_taskInfo
  //   }
  // }, [taskId, taskInfo, query]);

  // if (!taskInfo) {
  //   return <div className='loading'>Loading...</div>;
  // }

  // If you provide a link chain to ApolloClient, you
  // don't provide the `uri` option.
  // const client = new ApolloClient({
  //   // The `from` function combines an array of individual links
  //   // into a link chain
  //   link: from([errorLink, httpLink]),
  //   cache: new InMemoryCache(),
  // });

  // const handleAddNewApproach = (newApproach) => {
  const handleAddNewApproach = (addNewApproach) => {
    // setTaskInfo((pTask) => ({
    //   ...pTask,
    //   approachList: [newApproach, ...pTask.approachList],
    // }));
    const newApproachId = addNewApproach(taskInfo);
    setHighlightedApproachId(newApproachId);
    setShowAddApproach(false);
  };

  return (
    <div>
      <AppLink to='Home'>{'<'} Home</AppLink>
      <TaskSummary task={taskInfo} />
      <div>
        <div>
          {showAddApproach ? (
            <NewApproach taskId={taskId} onSuccess={handleAddNewApproach} />
          ) : (
            <div className='center y-spaced'>
              <button
                onClick={() => setShowAddApproach(true)}
                className='btn btn-secondary'
              >
                + Add New Approach
              </button>
            </div>
          )}
        </div>
        <h2>Approaches ({taskInfo.approachList.length})</h2>
        {taskInfo.approachList.map((approach) => (
          <div key={approach.id} id={approach.id}>
            <Approach
              approach={approach}
              isHighlighted={highlightedApproachId === approach.id}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
