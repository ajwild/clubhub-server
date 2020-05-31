/* eslint-disable functional/no-expression-statement */

import { schema } from 'nexus';

import { clubSchema, clubService } from '../../database';
import { Collections, DefinitionBlock } from '../../types';
import { convertSchemaToDefinition } from '../../utilities';

const { Club } = Collections;

export const clubObject = {
  name: Club as typeof Club,
  definition: convertSchemaToDefinition<typeof Club>(clubSchema),
};

export function clubQuery(
  t: DefinitionBlock<'Query'>
): DefinitionBlock<'Query'> {
  t.field('club', {
    type: Club,
    args: {
      id: schema.idArg({ required: true }),
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
    type: Club,
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
    type: Club,
    args: {
      name: schema.stringArg({ required: true }),
      description: schema.stringArg(),
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
    type: Club,
    args: {
      id: schema.idArg({ required: true }),
    },
    async resolve(_root: any, { id }: { readonly id: string }, _ctx: any) {
      return clubService.destroy(id);
    },
  });

  t.field('updateClub', {
    type: Club,
    args: {
      id: schema.idArg({ required: true }),
      name: schema.stringArg(),
      description: schema.stringArg(),
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
