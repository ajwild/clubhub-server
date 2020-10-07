/* eslint-disable functional/no-expression-statement */

import { idArg, objectType, stringArg } from '@nexus/schema';

import { userSchema, userService } from '../../database';
import { Collections, DefinitionBlock } from '../../types';
import { convertSchemaToDefinition } from '../../utilities';

export const User = objectType({
  name: Collections.User as typeof Collections.User,
  definition: convertSchemaToDefinition<typeof Collections.User>(userSchema),
});

export function userQuery(
  t: DefinitionBlock<'Query'>
): DefinitionBlock<'Query'> {
  t.field('user', {
    type: Collections.User,
    args: {
      id: idArg({ required: true }),
    },
    async resolve(_root: any, { id }: { readonly id: string }, _ctx: any) {
      // Unicorn assumes this is Array.prototype.find()
      // eslint-disable-next-line unicorn/no-fn-reference-in-iterator
      return userService.find(id);
    },
  });

  t.list.field('users', {
    type: Collections.User,
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
    type: Collections.User,
    args: {
      name: stringArg({ required: true }),
      description: stringArg(),
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
    type: Collections.User,
    args: {
      id: idArg({ required: true }),
    },
    async resolve(_root: any, { id }: { readonly id: string }, _ctx: any) {
      return userService.destroy(id);
    },
  });

  t.field('updateUser', {
    type: Collections.User,
    args: {
      id: idArg({ required: true }),
      name: stringArg(),
      description: stringArg(),
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
