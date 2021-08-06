// api\src\db\pg-api.js

import pgClient from './pg-client';
import sqls from './sqls';

const pgApiWrapper = async () => {
  const { pgPool } = await pgClient();
  const pgQuery = (text, params = {}) =>
    pgPool.query(text, Object.values(params));

  return {
    searchResults: async (searchTerms) => {
      const results = searchTerms.map(async (searchTerm) => {
        const pgResp = await pgQuery(sqls.searchResults, {
          $1: searchTerm,
          $2: null,
        });
        // this bascially returns an array of results of each item in the searchTerms array
        return pgResp.rows;
      });

      return Promise.all(results);
    },

    tasksByTypes: async (types) => {
      const results = types.map(async (type) => {
        if (type === 'latest') {
          const pgResp = await pgQuery(sqls.tasksLatest);
          return pgResp.rows;
        }
        throw Error('Unsupported type');
      });

      // waiting to resolve
      // still retuning promise from the method, but GQL will take care of it
      return Promise.all(results);
    },
    // TODO this is my own implementation
    taskInfo: async (taskId, userId) => {
      const pgResp = await pgQuery(sqls.tasksFromIds, {
        $1: [taskId],
        $2: userId,
      });

      return pgResp.rows[0];
    },

    tasksInfo: async (taskIds) => {
      console.log('taskIds', taskIds);
      const pgResp = await pgQuery(sqls.tasksFromIds, {
        $1: taskIds,
        $2: null,
      });

      return taskIds.map((taskId) => {
        return pgResp.rows.find((row) => row.id == taskId);
      });
    },
    // approachList: async (taskId) => {
    approachList: async (taskIds) => {
      const pgResp = await pgQuery(sqls.approachesForTaskIds, {
        // i really like this solution
        // where we later loop over values
        $1: [taskIds],
      });

      const taskApproachesMap = {};

      pgResp.rows.forEach((r) => {
        if (!taskApproachesMap[r.taskId]) {
          taskApproachesMap[r.taskId] = [];
        }

        taskApproachesMap[r.taskId].push(r);
      });

      console.log({ rows: pgResp.rows });
      // return pgResp.rows;
      return taskIds.map((taskId) => {
        /* this filter will return an array */
        // return pgResp.rows.filter((row) => taskId === row.taskId);
        // return pgResp.rows;

        // here now
        // check if there is anything in the map
        // and include it if there is
        if (!taskApproachesMap[taskId]) return null;
        return taskApproachesMap[taskId];
      });
    },
    taskMainList: async () => {
      const pgResp = await pgQuery(sqls.tasksLatest);
      return pgResp.rows;
    },
    // userInfo: async (userId) => {
    usersInfo: async (userIds) => {
      // usersFromIds already works with an array of user IDs
      const pgResp = await pgQuery(sqls.usersFromIds, {
        // in array, because we use ANY in the sql statement
        $1: [userIds],
      });

      // making the response an object

      const respRows = pgResp.rows.reduce((acc, row) => {
        // just make key the id, and value the entire value
        acc[row.id] = row;
        return acc;
      }, {});

      // return pgResp.rows[0];
      // this is now very erfficiatent
      // need to make sure response records are in the same order as the ids in the arguemnt
      return userIds.map((userId) => {
        // return pgResp.rows.find((row) => userId === row.id);
        if (!respRows[userId]) return null;
        return respRows[userId];
      });
    },
  };
};

export default pgApiWrapper;
