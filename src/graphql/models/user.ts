/* eslint-disable functional/no-expression-statement */

import { schema } from 'nexus';

import { userSchema, userService } from '../../database';
import { Collections, DefinitionBlock } from '../../types';
import { convertSchemaToDefinition } from '../../utilities';

const { User } = Collections;

export const userObject = {
  name: User as typeof User,
  definition: convertSchemaToDefinition<typeof User>(userSchema),
};

export function userQuery(
  t: DefinitionBlock<'Query'>
): DefinitionBlock<'Query'> {
  t.field('user', {
    type: User,
    args: {
      id: schema.idArg({ required: true }),
    },
    async resolve(_root: any, { id }: { readonly id: string }, _ctx: any) {
      // Unicorn assumes this is Array.prototype.find()
      // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
      return userService.find(id);
    },
  });

  t.list.field('users', {
    type: User,
    async resolve(_root: any, _args: any, _ctx: any) {
      return userService.findAll({});
    },
  });

  return t;
}

export function userMutation(
  t: DefinitionBlock<'Mutation'>
): DefinitionBlock<'Mutation'> {
  t.field('createUser', {
    type: User,
    args: {
      name: schema.stringArg({ required: true }),
      description: schema.stringArg(),
    },
    async resolve(
      _root: any,
      { ...properties }: { readonly [key: string]: any },
      _ctx: any
    ) {
      return userService.create(properties);
    },
  });

  t.field('deleteUser', {
    type: User,
    args: {
      id: schema.idArg({ required: true }),
    },
    async resolve(_root: any, { id }: { readonly id: string }, _ctx: any) {
      return userService.destroy(id);
    },
  });

  t.field('updateUser', {
    type: User,
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
      return userService.update(id, properties);
    },
  });

  return t;
}
