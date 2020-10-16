import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { Firestore } from '@google-cloud/firestore';
import { DeepReadonly, StrictOmit } from 'ts-essentials';

import { ClubDatabaseSchema } from '../../schemas/club';
import { setupDefaultFunctions } from './shared';
import { prepareDoc } from '../../utilities/database';

type ClubService = StrictOmit<
  ReturnType<typeof setupDefaultFunctions>,
  'create' | 'destroy'
> & {
  readonly create: (
    club: StrictOmit<ClubDatabaseSchema, 'id'>
  ) => TE.TaskEither<Error, ClubDatabaseSchema>;
  readonly destroy: (args: {
    readonly id: string;
    readonly slug: string;
  }) => TE.TaskEither<Error, null>;
};

const setupClubService = (db: DeepReadonly<Firestore>): ClubService => {
  const clubCollection = db.collection('club');

  return {
    ...setupDefaultFunctions(clubCollection),
    create: (club) =>
      TE.tryCatch(
        // eslint-disable-next-line functional/functional-parameters
        async () => {
          const clubRef = clubCollection.doc();
          const indexRef = db
            .collection('index')
            .doc(`club/slug/${club.slug as string}`);

          // eslint-disable-next-line functional/no-expression-statement
          await db
            .batch()
            .set(clubRef, club)
            .set(indexRef, { value: clubRef.id })
            .commit();

          const documentSnapshot = await clubRef.get();

          return prepareDoc<ClubDatabaseSchema>(documentSnapshot);
        },
        E.toError
      ),
    destroy: ({ id, slug }) =>
      TE.tryCatch(
        // eslint-disable-next-line functional/functional-parameters
        async () => {
          const clubRef = clubCollection.doc(id);
          const indexRef = db.collection('index').doc(`club/slug/${slug}`);

          // eslint-disable-next-line functional/no-expression-statement
          await db.batch().delete(clubRef).delete(indexRef).commit();

          return null;
        },
        E.toError
      ),
  };
};

export default setupClubService;
