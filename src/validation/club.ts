import { UserInputError } from 'apollo-server-fastify';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import { has } from 'ramda';

import { ClubDatabaseSchema } from '../schemas/club';
import { UpdateArgs } from '../types';

type MinimalArgs = { readonly id: string };

const hasOneOfManyProperties = (properties: readonly string[]) => <T>(
  data: T
) =>
  properties.some((property) => has(property, data))
    ? E.right(data)
    : E.left(
        new UserInputError(
          `Missing any of the following properties: ${properties.join(', ')}`
        )
      );

const hasProperty = (property: string) => <T extends MinimalArgs>(
  data: T
): E.Either<Error, T> =>
  has(property)<T>(data)
    ? E.right(data)
    : E.left(new UserInputError(`Missing property: ${property}`));

const hasIdProperty = hasProperty('id');

const hasProperties = (properties: readonly string[]) => <T>(
  data: T
): E.Either<Error, T> =>
  properties.every((property) => has(property)(data))
    ? E.right(data)
    : E.left(
        new UserInputError(
          `Missing one of the following properties: ${properties.join(', ')}`
        )
      );

const hasPropertiesOtherThanId = <T extends MinimalArgs>(
  data: T
): E.Either<Error, T> => {
  const { id, ...properties } = data;
  return Object.keys(properties).length > 0
    ? E.right(data)
    : E.left(new UserInputError('Properties required'));
};

type DestroyArgs = {
  readonly id: string;
  readonly slug: string;
};

export const destroy = (
  args: DestroyArgs
): E.Either<Readonly<Error>, DestroyArgs> =>
  hasProperties(['id', 'slug'])(args);

type FindByIdOrSlugArgs = Readonly<
  Pick<Partial<ClubDatabaseSchema>, 'id' | 'slug'>
>;

export const findByIdOrSlug = (
  args: FindByIdOrSlugArgs
): E.Either<Readonly<Error>, FindByIdOrSlugArgs> =>
  hasOneOfManyProperties(['id', 'slug'])(args);

type ClubUpdateArgs = UpdateArgs<ClubDatabaseSchema>;

export const update = (
  args: ClubUpdateArgs
): E.Either<Readonly<Error>, ClubUpdateArgs> =>
  pipe(hasIdProperty<ClubUpdateArgs>(args), E.chain(hasPropertiesOtherThanId));
