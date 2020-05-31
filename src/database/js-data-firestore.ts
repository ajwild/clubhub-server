// Move to separate npm module once fully implemented

import { Firestore, DocumentSnapshot } from '@google-cloud/firestore';
import { Mapper } from 'js-data';
import { Adapter } from 'js-data-adapter';
import { DeepReadonly } from 'ts-essentials';

type Document = Readonly<Record<string, any>>;
type Cursor = any;
type RecordCursorTuple = readonly [Document | void, Cursor];
type RecordArrayCursorTuple = readonly [readonly Document[] | void, Cursor];

function removeUndefinedProperties(document: Document): Document {
  return JSON.parse(JSON.stringify(document));
}

function prepareDoc(
  documentSnapshot: DeepReadonly<DocumentSnapshot>
): Document {
  return { id: documentSnapshot.id, ...documentSnapshot.data() };
}

function returnIfExists(
  documentSnapshot: DeepReadonly<DocumentSnapshot>,
  cursor?: Cursor
): RecordCursorTuple {
  return documentSnapshot?.exists
    ? [prepareDoc(documentSnapshot), cursor]
    : [undefined, cursor];
}

async function _find(
  db: Readonly<Firestore>,
  mapper: DeepReadonly<Mapper>,
  id: string,
  _options = {}
): Promise<RecordCursorTuple> {
  const documentSnapshot = await db.collection(mapper.name).doc(id).get();
  return returnIfExists(documentSnapshot);
}

async function _findAll(
  db: Readonly<Firestore>,
  mapper: DeepReadonly<Mapper>,
  _query = {},
  _options = {}
): Promise<RecordArrayCursorTuple> {
  const querySnapshot = await db.collection(mapper.name).get();
  const documents = querySnapshot.docs.map(
    (docSnapshot: DeepReadonly<DocumentSnapshot>) => prepareDoc(docSnapshot)
  );
  return [documents, undefined];
}

async function _create(
  db: Readonly<Firestore>,
  mapper: DeepReadonly<Mapper>,
  properties = {},
  _options = {}
): Promise<RecordCursorTuple> {
  const { id } = await db
    .collection(mapper.name)
    .add(removeUndefinedProperties(properties));
  return _find(db, mapper, id, _options);
}

async function _destroy(
  db: Readonly<Firestore>,
  mapper: DeepReadonly<Mapper>,
  id: string,
  _options = {}
): Promise<RecordCursorTuple> {
  // eslint-disable-next-line functional/no-expression-statement
  await db.collection(mapper.name).doc(id).delete();
  return _find(db, mapper, id, _options);
}

// eslint-disable-next-line max-params
async function _update(
  db: Readonly<Firestore>,
  mapper: DeepReadonly<Mapper>,
  id: string,
  properties = {},
  options = {}
): Promise<RecordCursorTuple> {
  // eslint-disable-next-line functional/no-expression-statement
  await db
    .collection(mapper.name)
    .doc(id)
    .update(removeUndefinedProperties(properties));
  return _find(db, mapper, id, options);
}

/* eslint-disable functional/no-this-expression */
// eslint-disable-next-line functional/no-class
export class FirestoreAdapter extends Adapter {
  readonly db: Firestore;

  constructor({ db }: { readonly db: Readonly<Firestore> }) {
    /* eslint-disable functional/no-expression-statement */
    super();

    this.db = db;
    /* eslint-enable functional/no-expression-statement */
  }

  readonly _create = async (
    mapper: DeepReadonly<Mapper>,
    properties = {},
    options = {}
  ): Promise<RecordCursorTuple> =>
    _create(this.db, mapper, properties, options);

  readonly _destroy = async (
    mapper: DeepReadonly<Mapper>,
    id: string,
    options = {}
  ): Promise<RecordCursorTuple> => _destroy(this.db, mapper, id, options);

  readonly _find = async (
    mapper: DeepReadonly<Mapper>,
    id: string,
    options = {}
  ): Promise<RecordCursorTuple> => _find(this.db, mapper, id, options);

  readonly _findAll = async (
    mapper: DeepReadonly<Mapper>,
    query = {},
    options = {}
  ): Promise<RecordArrayCursorTuple> =>
    _findAll(this.db, mapper, query, options);

  readonly _update = async (
    mapper: DeepReadonly<Mapper>,
    id: string,
    properties: Document,
    options = {}
  ): Promise<RecordCursorTuple> =>
    _update(this.db, mapper, id, properties, options);
}
/* eslint-enable functional/no-this-expression */
