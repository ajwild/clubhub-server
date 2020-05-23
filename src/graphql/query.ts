/*
eslint-disable
  @typescript-eslint/prefer-readonly-parameter-types,
  functional/no-expression-statement
*/

import { schema } from 'nexus';

import { clubQuery } from './club';
import { userQuery } from './user';

export const Query = schema.queryType({
  definition(t) {
    clubQuery(t);
    userQuery(t);
  },
});
