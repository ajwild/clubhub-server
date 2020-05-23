/*
eslint-disable
  @typescript-eslint/prefer-readonly-parameter-types,
  functional/no-expression-statement
*/

import { schema } from 'nexus';

import { store } from '../db';

export const userObject = schema.objectType({
  name: 'User',
  definition(t) {
    t.id('id');
    t.string('name');
    t.string('description');
  },
});

export function userQuery(t) {
  t.field('user', {
    type: 'User',
    args: {
      id: schema.idArg({ required: true }),
    },
    async resolve(_root, { id }, _ctx) {
      return store.find('user', id, {});
    },
  });

  t.list.field('users', {
    type: 'User',
    async resolve(_root, _args, _ctx) {
      return store.findAll('user', {}, {});
    },
  });

  return t;
}

export function userMutation(t) {
  t.field('createUser', {
    type: 'User',
    args: {
      name: schema.stringArg({ required: true }),
      description: schema.stringArg(),
    },
    async resolve(_root, { ...properties }, _ctx) {
      return store.create('user', properties, {});
    },
  });

  t.field('deleteUser', {
    type: 'User',
    args: {
      id: schema.idArg({ required: true }),
    },
    async resolve(_root, { id }, _ctx) {
      return store.destroy('user', id, {});
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
      return store.update('user', id, properties, {});
    },
  });

  return t;
}
