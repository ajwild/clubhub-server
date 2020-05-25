/*
eslint-disable
  @typescript-eslint/prefer-readonly-parameter-types,
  functional/no-expression-statement
*/

import { schema } from 'nexus';

import { clubSchema, clubService } from '../../database';
import { convertSchemaToDefinition } from '../../utilities';

export const clubObject = {
  name: 'Club',
  definition: convertSchemaToDefinition(clubSchema),
};

export function clubQuery(t): typeof t {
  t.field('club', {
    type: 'Club',
    args: {
      id: schema.idArg({ required: true }),
    },
    async resolve(_root, { id }, _ctx) {
      return clubService.find(id);
    },
  });

  t.list.field('clubs', {
    type: 'Club',
    async resolve(_root, _args, _ctx) {
      return clubService.findAll({});
    },
  });

  return t;
}

export function clubMutation(t): typeof t {
  t.field('createClub', {
    type: 'Club',
    args: {
      name: schema.stringArg({ required: true }),
      description: schema.stringArg(),
    },
    async resolve(_root, { ...properties }, _ctx) {
      return clubService.create(properties);
    },
  });

  t.field('deleteClub', {
    type: 'Club',
    args: {
      id: schema.idArg({ required: true }),
    },
    async resolve(_root, { id }, _ctx) {
      return clubService.destroy(id);
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
      return clubService.update(id, properties);
    },
  });

  return t;
}
