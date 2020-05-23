// Move to separate npm module once fully implemented

import { Adapter } from 'js-data-adapter';

function prepareDoc(docRef) {
  return { id: docRef.id, ...docRef.data() };
}

function returnIfExists(documentSnapshot, cursor) {
  return documentSnapshot?.exists
    ? [prepareDoc(documentSnapshot), cursor]
    : [undefined, cursor];
}

async function _find(db, mapper, id: string, _options = {}) {
  const documentSnapshot = await db.collection(mapper.name).doc(id).get();
  return returnIfExists(documentSnapshot);
}

async function _findAll(db, mapper, _query, _options = {}) {
  const querySnapshot = await db.collection(mapper.name).get();
  const documents = querySnapshot.docs.map((docSnapshot) =>
    prepareDoc(docSnapshot)
  );
  return [documents, {}];
}

async function _create(db, mapper, properties = {}, _options = {}) {
  const { id } = await db.collection(mapper.name).add(properties);
  return _find(db, mapper, id, _options);
}

async function _destroy(db, mapper, id: string, _options = {}) {
  // eslint-disable-next-line functional/no-expression-statement
  await db.collection(mapper.name).doc(id).delete();
  return _find(db, mapper, id, _options);
}

async function _update(db, mapper, id: string, properties = {}, _options = {}) {
  // eslint-disable-next-line functional/no-expression-statement
  await db.collection(mapper.name).doc(id).update(properties);
  return _find(db, mapper, id, _options);
}

// eslint-disable functional/no-this-expression
// eslint-disable-next-line functional/no-class
export class FirestoreAdapter extends Adapter {
  constructor({ db }) {
    super();

    this.db = db;
  }

  readonly _create = (mapper, properties, options) =>
    _create(this.db, mapper, properties, options);

  readonly _destroy = (mapper, id, options) =>
    _destroy(this.db, mapper, id, options);

  readonly _find = (mapper, id, options) => _find(this.db, mapper, id, options);

  readonly _findAll = (mapper, query, options) =>
    _findAll(this.db, mapper, query, options);

  readonly _update = (mapper, id, properties, options) =>
    _update(this.db, mapper, id, properties, options);
}
// eslint-enable functional/no-this-expression
