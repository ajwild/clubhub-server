import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import {
  CollectionReference,
  DocumentSnapshot,
  WhereFilterOp,
} from '@google-cloud/firestore';
import { DeepReadonly, ValueOf } from 'ts-essentials';

import { MinimalSchema, UpdateArgs } from '../../types';
import { prepareDoc, returnIfExists } from '../../utilities/database';

const create = (collection: DeepReadonly<CollectionReference>) =>
  // eslint-disable-next-line @typescript-eslint/ban-types
  <Schema extends MinimalSchema>(data: Omit<Schema, 'id'>) =>
    TE.tryCatch(
      // eslint-disable-next-line functional/functional-parameters
      async () => {
        const documentReference = await collection.add(data);
        const documentSnapshot = await documentReference.get();
        return prepareDoc<Schema>(documentSnapshot);
      },
      E.toError
    );

export const destroy = (collection: DeepReadonly<CollectionReference>) => (
  id: string
) =>
  TE.tryCatch(
    // eslint-disable-next-line functional/functional-parameters
    async () => {
      // eslint-disable-next-line functional/no-expression-statement
      await collection.doc(id).delete();
      return null;
    },
    E.toError
  );

export const findAll = (collection: DeepReadonly<CollectionReference>) =>
  // eslint-disable-next-line functional/functional-parameters
  <Schema extends MinimalSchema>() =>
    TE.tryCatch(
      // eslint-disable-next-line functional/functional-parameters
      async () => {
        const querySnapShot = await collection.get();
        return querySnapShot.docs.flatMap(
          (documentSnapshot: DeepReadonly<DocumentSnapshot>) => {
            const document = returnIfExists<Schema>(documentSnapshot);
            return document ? [document] : [];
          }
        );
      },
      (error) => [E.toError(error)]
    );

export const findById = (collection: DeepReadonly<CollectionReference>) => <
  Schema extends MinimalSchema
>(
  id: string
) =>
  TE.tryCatch(
    // eslint-disable-next-line functional/functional-parameters
    async () => {
      const documentSnapshot = await collection.doc(id).get();
      return returnIfExists<Schema>(documentSnapshot);
    },
    E.toError
  );

export const findOne = (collection: DeepReadonly<CollectionReference>) => <
  Schema extends MinimalSchema
>(
  field: keyof Schema,
  operator: WhereFilterOp,
  value: any
) =>
  TE.tryCatch(
    // eslint-disable-next-line functional/functional-parameters
    async () => {
      const querySnapShot = await collection
        .where(field as string, operator, value)
        .limit(1)
        .get();
      return returnIfExists<Schema>(querySnapShot.docs[0]);
    },
    E.toError
  );

const update = (collection: DeepReadonly<CollectionReference>) => <Schema>(
  data: UpdateArgs<Schema>
) =>
  TE.tryCatch(
    // eslint-disable-next-line functional/functional-parameters
    async () => {
      // eslint-disable-next-line functional/no-expression-statement
      await collection.doc(data.id).update(data);
      return data;
    },
    E.toError
  );

type DefaultDbFunctions = {
  readonly create: typeof create;
  readonly destroy: typeof destroy;
  readonly findAll: typeof findAll;
  readonly findById: typeof findById;
  readonly findOne: typeof findOne;
  readonly update: typeof update;
};

const defaultDbFunctions: DefaultDbFunctions = {
  create,
  destroy,
  findAll,
  findById,
  findOne,
  update,
};

type DefaultDbService = {
  readonly create: ReturnType<typeof create>;
  readonly destroy: ReturnType<typeof destroy>;
  readonly findAll: ReturnType<typeof findAll>;
  readonly findById: ReturnType<typeof findById>;
  readonly findOne: ReturnType<typeof findOne>;
  readonly update: ReturnType<typeof update>;
};

export const setupDefaultFunctions = (
  collection: DeepReadonly<CollectionReference>
  // @ts-ignore
): DefaultDbService => ({
  ...Object.entries(defaultDbFunctions).reduce<DefaultDbService>(
    (
      accumulator,
      [dbFunctionName, dbFunction]: readonly [
        string,
        ValueOf<DefaultDbFunctions>
      ]
    ) => ({
      ...accumulator,
      [dbFunctionName]: dbFunction(collection),
    }),
    // @ts-ignore: This should be set  by reduce<DefaultDbService>()!
    {}
  ),
});
