/*
eslint-disable
  @typescript-eslint/prefer-readonly-parameter-types,
  functional/no-expression-statement
*/

import { schema } from 'nexus';

import { clubMutation } from './models/club';
import { userMutation } from './models/user';

export const mutation = schema.mutationType({
  definition(t) {
    clubMutation(t);
    userMutation(t);
  },
});
