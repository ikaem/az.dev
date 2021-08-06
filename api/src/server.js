// api\src\server.js

import express from 'express';
// import { graphql } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import morgan from 'morgan';

import * as config from './config';
import { schema } from './schema';
// import pgClient from './db/pg-client';
import pgApiWrapper from './db/pg-api';
import DataLoader from 'dataloader';

// const executeGraphQLRequest = async (request) => {
//   const resp = await graphql(schema, request, rootValue);
//   console.log(resp.data);
// };

// executeGraphQLRequest(process.argv[2]);

// graphql(schema, request, rootValue);

async function main() {
  // const { pgPool } = await pgClient();
  const pgApi = await pgApiWrapper();
  const server = express();
  server.use(cors());
  server.use(morgan('dev'));
  server.use(express.urlencoded({ extended: false }));
  server.use(express.json());
  server.use('/:fav.ico', (req, res) => res.sendStatus(204));

  // Example route
  // this uses all verbs
  // it should probably be post only
  server.use(
    '/',

    (req, res) => {
      const loaders = {
        users: new DataLoader((userIds) => pgApi.usersInfo(userIds)),
        approachList: new DataLoader((taskIds) => pgApi.approachList(taskIds)),
        tasks: new DataLoader((taskIds) => pgApi.tasksInfo(taskIds)),
        tasksByTypes: new DataLoader((types) => pgApi.tasksByTypes(types)),
        searchResults: new DataLoader((searchTerms) =>
          pgApi.searchResults(searchTerms)
        ),
      };

      graphqlHTTP({
        schema,
        // rootValue,
        context: {
          // pgPool,
          pgApi,
          loaders,
        },
        graphiql: true,
        customFormatErrorFn: (err) => {
          const errorReport = {
            message: err.message,
            locations: err.locations,
            // this is to show the error stack - useful in development
            stack: err.stack ? err.stack.split('\n') : [],
            path: err.path,
          };
          // this logs the error in the server logs
          console.error('GraphQL Error', errorReport);
          return config.isDev
            ? // this will return proper error in dev
              errorReport
            : // and this is for nice error in production
              { message: 'Oops! Something went wrong...' };
        },
      })(req, res);
    }
  );

  // This line rus the server
  server.listen(config.port, () => {
    console.log(`Server URL: http://localhost:${config.port}/`);
  });
}

main();

// node -r esm api/src/server.js "{ currentTime }"

// ["path/to/node/command", "api/src/server.js", "{ currentTime }"]
