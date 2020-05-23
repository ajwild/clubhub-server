/*
eslint-disable
  @typescript-eslint/prefer-readonly-parameter-types,
  functional/no-expression-statement
*/

import { schema } from 'nexus';

import { clubMutation } from './club';
import { userMutation } from './user';

export const Mutation = schema.mutationType({
  definition(t) {
    clubMutation(t);
    userMutation(t);
  },
});
