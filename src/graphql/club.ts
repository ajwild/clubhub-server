/*
eslint-disable
  @typescript-eslint/prefer-readonly-parameter-types,
  functional/no-expression-statement
*/

import { schema } from 'nexus';

import { store } from '../db';

export const clubObject = schema.objectType({
  name: 'Club',
  definition(t) {
    t.id('id');
    t.string('name');
    t.string('description');
  },
});

export function clubQuery(t) {
  t.field('club', {
    type: 'Club',
    args: {
      id: schema.idArg({ required: true }),
    },
    async resolve(_root, { id }, _ctx) {
      return store.find('club', id, {});
    },
  });

  t.list.field('clubs', {
    type: 'Club',
    async resolve(_root, _args, _ctx) {
      return store.findAll('club', {}, {});
    },
  });

  return t;
}

export function clubMutation(t) {
  t.field('createClub', {
    type: 'Club',
    args: {
      name: schema.stringArg({ required: true }),
      description: schema.stringArg(),
    },
    async resolve(_root, { ...properties }, _ctx) {
      return store.create('club', properties, {});
    },
  });

  t.field('deleteClub', {
    type: 'Club',
    args: {
      id: schema.idArg({ required: true }),
    },
    async resolve(_root, { id }, _ctx) {
      return store.destroy('club', id, {});
    },
  });

  t.field('updateClub', {
    type: 'Club',
    args: {
      id: schema.idArg({ required: true }),
      name: schema.stringArg(),
      description: schema.stringArg(),
    },
    async resolve(_root, { id, ...properties }, _ctx) {
      return store.update('club', id, properties, {});
    },
  });

  return t;
}
