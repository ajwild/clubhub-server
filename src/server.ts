import { ApolloServer } from 'apollo-server-fastify';
import fastify from 'fastify';
import { applyMiddleware } from 'graphql-middleware';

import { schema } from './graphql/schema';
import { authentication } from './middleware/authentication';
import { permissions } from './middleware/permissions';

const { PORT } = process.env;
const app = fastify({ logger: { prettyPrint: true } });
const server = new ApolloServer({
  schema: applyMiddleware(schema, permissions),
  context: ({ request, _reply }) => {
    const authenticationContext = authentication(request);

    return {
      ...authenticationContext,
    };
  },
});

/* eslint-disable functional/no-expression-statement */
(async () => {
  await app.register(server.createHandler());
  const serverUrl = await app.listen(Number(PORT) || 4000);
  console.log(`🚀 Server ready at ${serverUrl}`);
})();
/* eslint-enable functional/no-expression-statement */
