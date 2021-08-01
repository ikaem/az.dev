// api\src\server.js

import express from 'express';
// import { graphql } from 'graphql';
import { graphqlHTTP } from 'express-graphql';
import cors from 'cors';
import morgan from 'morgan';

import * as config from './config';
import { schema, rootValue } from './schema';

// const executeGraphQLRequest = async (request) => {
//   const resp = await graphql(schema, request, rootValue);
//   console.log(resp.data);
// };

// executeGraphQLRequest(process.argv[2]);

// graphql(schema, request, rootValue);

async function main() {
  const server = express();
  server.use(cors());
  server.use(morgan('dev'));
  server.use(express.urlencoded({ extended: false }));
  server.use(express.json());
  server.use('/:fav.ico', (req, res) => res.sendStatus(204));

  // Example route
  server.use(
    '/',
    graphqlHTTP({
      schema,
      rootValue,
      graphiql: true,
    })
  );

  // This line rus the server
  server.listen(config.port, () => {
    console.log(`Server URL: http://localhost:${config.port}/`);
  });
}

main();

// node -r esm api/src/server.js "{ currentTime }"

// ["path/to/node/command", "api/src/server.js", "{ currentTime }"]
