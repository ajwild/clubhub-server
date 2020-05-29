/* eslint-disable functional/no-expression-statement */

import { schema, settings, use } from 'nexus';

import { authentication } from './middleware/authentication';
import { permissions } from './middleware/permissions';

schema.middleware(authentication);

use(permissions);

settings.change({
  server: {
    port: 4001,
  },
});
