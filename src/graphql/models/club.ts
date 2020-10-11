/* eslint-disable functional/no-expression-statement */

import { idArg, objectType, stringArg } from '@nexus/schema';

import { clubSchema, clubService } from '../../database';
import { Collections, DefinitionBlock } from '../../types';
import { convertSchemaToDefinition } from '../../utilities';

export const Club = objectType({
  name: Collections.Club as typeof Collections.Club,
  definition: convertSchemaToDefinition<typeof Collections.Club>(clubSchema),
});

export function clubQuery(
  t: DefinitionBlock<'Query'>
): DefinitionBlock<'Query'> {
  t.field('club', {
    type: Collections.Club,
    args: {
      id: idArg({ required: true }),
    },
    async resolve(
      _root: any,
      { id }: { readonly [key: string]: string },
      _ctx: any
    ) {
      // Unicorn assumes this is Array.prototype.find()
      // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
      return clubService.find(id);
    },
  });

  t.list.field('clubs', {
    type: Collections.Club,
    async resolve(_root: any, _args: any, _ctx: any) {
      return clubService.findAll({});
    },
  });

  return t;
}

export function clubMutation(
  t: DefinitionBlock<'Mutation'>
): DefinitionBlock<'Mutation'> {
  t.field('createClub', {
    type: Collections.Club,
    args: {
      description: stringArg(),
      location: stringArg({ required: true }),
      name: stringArg({ required: true }),
      website: stringArg(),
    },
    async resolve(
      _root: any,
      { ...properties }: { readonly [key: string]: any },
      _ctx: any
    ) {
      return clubService.create(properties);
    },
  });

  t.field('deleteClub', {
    type: Collections.Club,
    args: {
      id: idArg({ required: true }),
    },
    async resolve(_root: any, { id }: { readonly id: string }, _ctx: any) {
      return clubService.destroy(id);
    },
  });

  t.field('updateClub', {
    type: Collections.Club,
    args: {
      id: idArg({ required: true }),
      description: stringArg(),
      location: stringArg(),
      name: stringArg(),
      website: stringArg(),
    },
    async resolve(
      _root: any,
      {
        id,
        ...properties
      }: { readonly [key: string]: any; readonly id: string },
      _ctx: any
    ) {
      return clubService.update(id, properties);
    },
  });

  return t;
}
