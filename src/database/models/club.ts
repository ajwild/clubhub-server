import { ValidationError } from 'apollo-server-fastify';
import * as E from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/pipeable';
import * as TE from 'fp-ts/lib/TaskEither';
import {
  CollectionReference,
  DocumentReference,
  Firestore,
  QuerySnapshot,
} from '@google-cloud/firestore';
import { DeepReadonly, StrictOmit } from 'ts-essentials';

import { ClubDatabaseSchema } from '../../schemas/club';
import { setupDefaultFunctions } from './shared';
import { prepareDoc } from '../../utilities/database';

type ClubService = StrictOmit<
  ReturnType<typeof setupDefaultFunctions>,
  'create'
> & {
  readonly create: (
    club: StrictOmit<ClubDatabaseSchema, 'id'>
  ) => TE.TaskEither<Error, ClubDatabaseSchema>;
};

const findClubBySlug = (
  clubCollection: DeepReadonly<CollectionReference>,
  club: StrictOmit<ClubDatabaseSchema, 'id'>,
  limit = 1
) => ({
  documentReference,
}: {
  readonly documentReference?: DeepReadonly<DocumentReference>;
} = {}): TE.TaskEither<
  Error,
  {
    readonly documentReference?: DeepReadonly<DocumentReference>;
    readonly querySnapshot: DeepReadonly<QuerySnapshot>;
  }
> =>
  // eslint-disable-next-line functional/functional-parameters
  TE.tryCatch(async () => {
    const querySnapshot = await clubCollection
      .where('slug', '==', club.slug)
      .limit(limit)
      .get();

    return { documentReference, querySnapshot };
  }, E.toError);

const validateNoClubsFound = ({
  querySnapshot,
}: {
  readonly querySnapshot: DeepReadonly<QuerySnapshot>;
}): TE.TaskEither<Error, null> =>
  querySnapshot.empty
    ? TE.right(null)
    : TE.left(
        new ValidationError(
          'The following unique property has already been used: slug'
        )
      );

const addClubToCollection = (
  clubCollection: DeepReadonly<CollectionReference>,
  club: StrictOmit<ClubDatabaseSchema, 'id'>
) =>
  // eslint-disable-next-line functional/functional-parameters
  (): TE.TaskEither<Error, { readonly documentReference: DocumentReference }> =>
    // eslint-disable-next-line functional/functional-parameters
    TE.tryCatch(async () => {
      const documentReference = await clubCollection.add(club);
      return { documentReference };
    }, E.toError);

const validateClubAdded = ({
  documentReference,
  querySnapshot,
}: {
  readonly documentReference?: DeepReadonly<DocumentReference>;
  readonly querySnapshot: DeepReadonly<QuerySnapshot>;
}): TE.TaskEither<
  Error,
  {
    readonly documentReference: DeepReadonly<DocumentReference>;
    readonly querySnapshot: DeepReadonly<QuerySnapshot>;
  }
> =>
  documentReference
    ? TE.right({ documentReference, querySnapshot })
    : TE.left(new Error('Failed'));

const rollbackClub = (
  documentReference: DeepReadonly<DocumentReference>
): TE.TaskEither<Error, never> =>
  // eslint-disable-next-line functional/functional-parameters
  TE.tryCatch(async () => {
    // eslint-disable-next-line functional/no-expression-statement
    await documentReference.delete();
    // eslint-disable-next-line functional/no-throw-statement
    throw new ValidationError(
      'The following unique property has already been used: slug'
    );
  }, E.toError);

const rollbackClubIfNecessary = ({
  documentReference,
  querySnapshot,
}: {
  readonly documentReference: DeepReadonly<DocumentReference>;
  readonly querySnapshot: DeepReadonly<QuerySnapshot>;
}): TE.TaskEither<Error, DeepReadonly<DocumentReference>> =>
  querySnapshot.size === 1
    ? TE.right(documentReference)
    : rollbackClub(documentReference);

const getAndPrepareDocument = (
  documentReference: DeepReadonly<DocumentReference>
): TE.TaskEither<Error, ClubDatabaseSchema> =>
  // eslint-disable-next-line functional/functional-parameters
  TE.tryCatch(async () => {
    const documentSnapshot = await documentReference.get();
    return prepareDoc<ClubDatabaseSchema>(documentSnapshot);
  }, E.toError);

const setupClubService = (db: DeepReadonly<Firestore>): ClubService => {
  const clubCollection = db.collection('club');

  return {
    ...setupDefaultFunctions(clubCollection),
    create: (club) =>
      pipe(
        findClubBySlug(clubCollection, club, 1)(),
        TE.chain(validateNoClubsFound),
        TE.chain(addClubToCollection(clubCollection, club)),
        TE.chain(findClubBySlug(clubCollection, club, 2)),
        TE.chain(validateClubAdded),
        TE.chain(rollbackClubIfNecessary),
        TE.chain(getAndPrepareDocument)
      ),
  };
};

export default setupClubService;
