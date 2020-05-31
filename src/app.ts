/* eslint-disable functional/no-expression-statement */

import { schema, settings, use } from 'nexus';

import { authentication } from './middleware/authentication';
import { permissions } from './middleware/permissions';

schema.middleware(authentication);

use(permissions);

const { PORT } = process.env;
settings.change({
  server: {
    port: PORT ? Number.parseInt(PORT, 10) : 4000,
  },
});
