// api\src\server.js

import express from 'express';
// import { graphql } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import morgan from 'morgan';

import * as config from './config';
import { schema } from './schema';
// import pgClient from './db/pg-client';
import DataLoader from 'dataloader';
import pgApiWrapper from './db/pg-api';
import mongoApiWrapper from './db/mongo-api';

// const executeGraphQLRequest = async (request) => {
//   const resp = await graphql(schema, request, rootValue);
//   console.log(resp.data);
// };

// executeGraphQLRequest(process.argv[2]);

// graphql(schema, request, rootValue);

async function main() {
  // const { pgPool } = await pgClient();
  const pgApi = await pgApiWrapper();
  const mongoApi = await mongoApiWrapper();
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

    async (req, res) => {
      const authToken =
        req && req.headers && req.headers.authorization
          ? req.headers.authorization.slice(7)
          : null;

      const currentUser = await pgApi.userFromAuthToken(authToken);

      // this is cool, because this null auth token can make the current user null? and we are ok with null
      if (authToken && !currentUser) {
        // i dont get why would this be resolved as part of GQL server? it never reaches the gql implementation?
        return res.status(401).send({
          errors: [{ message: 'Invalid access token' }],
        });
      }

      const mutators = {
        ...pgApi.mutators,
        ...mongoApi.mutators,
      };
      const loaders = {
        tasksForUsers: new DataLoader((userIds) =>
          pgApi.tasksForUsers(userIds)
        ),
        detailList: new DataLoader((approachIds) =>
          mongoApi.detailList(approachIds)
        ),
        users: new DataLoader((userIds) => pgApi.usersInfo(userIds)),
        approachList: new DataLoader((taskIds) => pgApi.approachList(taskIds)),
        tasks: new DataLoader((taskIds) =>
          pgApi.tasksInfo({ taskIds, currentUser })
        ),
        tasksByTypes: new DataLoader((types) => pgApi.tasksByTypes(types)),
        searchResults: new DataLoader((searchTerms) =>
          pgApi.searchResults({ searchTerms, currentUser })
        ),
      };

      graphqlHTTP({
        schema,
        // rootValue,
        context: {
          // pgPool,
          pgApi,
          loaders,
          mutators,
          // I like this
          currentUser,
        },
        // graphiql: true, -> not a boolean anymore
        graphiql: {
          headerEditorEnabled: true,
        },
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
