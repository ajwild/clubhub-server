/*
eslint-disable
  @typescript-eslint/prefer-readonly-parameter-types,
  functional/no-expression-statement
*/

import { schema } from 'nexus';

import { clubQuery } from './models/club';
import { userQuery } from './models/user';

export const query = schema.queryType({
  definition(t) {
    clubQuery(t);
    userQuery(t);
  },
});
