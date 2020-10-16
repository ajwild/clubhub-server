/* eslint-disable functional/no-expression-statement */

import { pipe } from 'fp-ts/lib/pipeable';
import * as T from 'fp-ts/lib/Task';
import * as TE from 'fp-ts/lib/TaskEither';
import { idArg, objectType, stringArg } from '@nexus/schema';
import { DeepNonNullable, StrictOmit } from 'ts-essentials';

import { clubService } from '../../database';
import { ClubDatabaseSchema, clubGraphqlSchema } from '../../schemas/club';
import { Collections, DefinitionBlock, UpdateArgs } from '../../types';
import { convertSchemaToDefinition } from '../../utilities';
import * as clubValidation from '../../validation/club';

export const Club = objectType({
  name: Collections.Club,
  definition: convertSchemaToDefinition<Collections.Club, ClubDatabaseSchema>(
    clubGraphqlSchema
  ),
});

export function clubQuery(
  t: DefinitionBlock<'Query'>
): DefinitionBlock<'Query'> {
  t.field('club', {
    type: Collections.Club,
    args: {
      id: idArg(),
      slug: stringArg(),
    },
    resolve: async (
      _root: any,
      args: Pick<Partial<ClubDatabaseSchema>, 'id' | 'slug'>,
      _ctx: any
    ) =>
      pipe(
        TE.fromEither(clubValidation.findByIdOrSlug(args)),
        TE.chain(({ id, slug }) =>
          id
            ? clubService.findById<ClubDatabaseSchema>(id)
            : clubService.findOne<ClubDatabaseSchema>('slug', '==', slug)
        ),
        TE.fold<
          Readonly<Error>,
          ClubDatabaseSchema | null,
          Readonly<Error> | ClubDatabaseSchema | null
        >(T.of, T.of)
      )(),
  });

  t.list.field('clubs', {
    type: Collections.Club,
    resolve: async (_root: any, _args: any, _ctx: any) =>
      pipe(
        clubService.findAll<ClubDatabaseSchema>(),
        // eslint-disable-next-line functional/prefer-readonly-type
        TE.fold<Error[], ClubDatabaseSchema[], Error[] | ClubDatabaseSchema[]>(
          T.of,
          T.of
        )
      )(),
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
      slug: stringArg({ required: true }),
      website: stringArg(),
    },
    resolve: async (
      _root: any,
      args: StrictOmit<ClubDatabaseSchema, 'id'>,
      _ctx: any
    ) =>
      pipe(
        clubService.create(args),
        TE.fold<
          Readonly<Error>,
          ClubDatabaseSchema,
          Readonly<Error> | ClubDatabaseSchema
        >(T.of, T.of)
      )(),
  });

  t.field('deleteClub', {
    type: Collections.Club,
    args: {
      id: idArg({ required: true }),
      slug: stringArg({ required: true }),
    },
    resolve: async (
      _root: any,
      args: DeepNonNullable<Pick<ClubDatabaseSchema, 'id' | 'slug'>>,
      _ctx: any
    ) =>
      pipe(
        TE.fromEither(clubValidation.destroy(args)),
        TE.chain(clubService.destroy),
        TE.fold<Readonly<Error>, null, Readonly<Error> | null>(T.of, T.of)
      )(),
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
    resolve: async (
      _root: any,
      args: UpdateArgs<ClubDatabaseSchema>,
      _ctx: any
    ) =>
      pipe(
        TE.fromEither(clubValidation.update(args)),
        TE.chain(clubService.update),
        TE.fold<
          Readonly<Error>,
          UpdateArgs<ClubDatabaseSchema>,
          Readonly<Error> | UpdateArgs<ClubDatabaseSchema>
        >(T.of, T.of)
      )(),
  });

  return t;
}
