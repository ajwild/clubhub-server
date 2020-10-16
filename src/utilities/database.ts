import { DocumentSnapshot } from '@google-cloud/firestore';
import { DeepReadonly } from 'ts-essentials';

import { MinimalSchema } from '../types';

export function removeUndefinedProperties<DocumentSchema>(
  document: DocumentSchema
): DocumentSchema {
  return JSON.parse(JSON.stringify(document));
}

export function prepareDoc<DocumentSchema extends MinimalSchema>(
  documentSnapshot: DeepReadonly<DocumentSnapshot>
): DocumentSchema {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return {
    id: documentSnapshot.id,
    ...documentSnapshot.data(),
  } as DocumentSchema;
}

export function returnIfExists<DocumentSchema extends MinimalSchema>(
  documentSnapshot: DeepReadonly<DocumentSnapshot>
): DocumentSchema | null {
  return documentSnapshot?.exists
    ? prepareDoc<DocumentSchema>(documentSnapshot)
    : null;
}
