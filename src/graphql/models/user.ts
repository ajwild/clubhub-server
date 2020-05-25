/*
eslint-disable
  @typescript-eslint/prefer-readonly-parameter-types,
  functional/no-expression-statement
*/

import { schema } from 'nexus';

import { userSchema, userService } from '../../database';
import { convertSchemaToDefinition } from '../../utilities';

export const userObject = {
  name: 'User',
  definition: convertSchemaToDefinition(userSchema),
};

export function userQuery(t): typeof t {
  t.field('user', {
    type: 'User',
    args: {
      id: schema.idArg({ required: true }),
    },
    async resolve(_root, { id }, _ctx) {
      return userService.find(id);
    },
  });

  t.list.field('users', {
    type: 'User',
    async resolve(_root, _args, _ctx) {
      return userService.findAll({});
    },
  });

  return t;
}

export function userMutation(t): typeof t {
  t.field('createUser', {
    type: 'User',
    args: {
      name: schema.stringArg({ required: true }),
      description: schema.stringArg(),
    },
    async resolve(_root, { ...properties }, _ctx) {
      return userService.create(properties);
    },
  });

  t.field('deleteUser', {
    type: 'User',
    args: {
      id: schema.idArg({ required: true }),
    },
    async resolve(_root, { id }, _ctx) {
      return userService.destroy(id);
    },
  });

  t.field('updateUser', {
    type: 'User',
    args: {
      id: schema.idArg({ required: true }),
      name: schema.stringArg(),
      description: schema.stringArg(),
    },
    async resolve(_root, { id, ...properties }, _ctx) {
      return userService.update(id, properties);
    },
  });

  return t;
}
