/* eslint-disable functional/no-expression-statement */

import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { idArg, objectType, stringArg } from '@nexus/schema';
import { StrictOmit } from 'ts-essentials';

import { userService } from '../../database';
import { UserDatabaseSchema, userGraphqlSchema } from '../../schemas/user';
import { Collections, DefinitionBlock, UpdateArgs } from '../../types';
import { convertSchemaToDefinition } from '../../utilities';

export const User = objectType({
  name: Collections.User,
  definition: convertSchemaToDefinition<Collections.User, UserDatabaseSchema>(
    userGraphqlSchema
  ),
});

export function userQuery(
  t: DefinitionBlock<'Query'>
): DefinitionBlock<'Query'> {
  t.field('user', {
    type: Collections.User,
    args: {
      id: idArg({ required: true }),
    },
    resolve: async (_root: any, { id }: { readonly id: string }, _ctx: any) =>
      pipe(
        userService.findById<UserDatabaseSchema>(id),
        TE.fold<
          Readonly<Error>,
          UserDatabaseSchema | null,
          Readonly<Error> | UserDatabaseSchema | null
        >(T.of, T.of)
      )(),
  });

  t.list.field('users', {
    type: Collections.User,
    resolve: async (_root: any, _args: any, _ctx: any) =>
      pipe(
        userService.findAll<UserDatabaseSchema>(),
        // eslint-disable-next-line functional/prefer-readonly-type
        TE.fold<Error[], UserDatabaseSchema[], Error[] | UserDatabaseSchema[]>(
          T.of,
          T.of
        )
      )(),
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
    resolve: async (
      _root: any,
      properties: StrictOmit<UserDatabaseSchema, 'id'>,
      _ctx: any
    ) =>
      pipe(
        userService.create<UserDatabaseSchema>(properties),
        TE.fold<Error, UserDatabaseSchema, Error | UserDatabaseSchema>(
          T.of,
          T.of
        )
      )(),
  });

  t.field('deleteUser', {
    type: Collections.User,
    args: {
      id: idArg({ required: true }),
    },
    resolve: async (_root: any, { id }: { readonly id: string }, _ctx: any) =>
      pipe(
        userService.destroy(id),
        TE.fold<Error, null, Error | null>(T.of, T.of)
      )(),
  });

  t.field('updateUser', {
    type: Collections.User,
    args: {
      id: idArg({ required: true }),
      name: stringArg(),
      description: stringArg(),
    },
    resolve: async (
      _root: any,
      args: UpdateArgs<UserDatabaseSchema>,
      _ctx: any
    ) =>
      pipe(
        userService.update<UserDatabaseSchema>(args),
        TE.fold<
          Error,
          UpdateArgs<UserDatabaseSchema>,
          Error | UpdateArgs<UserDatabaseSchema>
        >(T.of, T.of)
      )(),
  });

  return t;
}
