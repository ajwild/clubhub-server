/* eslint-disable functional/no-expression-statement */

import * as admin from 'firebase-admin';
import { Container } from 'js-data';
import { FirestoreAdapter } from './js-data-firestore';

admin.initializeApp();
const db = admin.firestore();
// eslint-disable-next-line functional/no-conditional-statement
if (process.env.FIRESTORE_HOST) {
  db.settings({
    host: process.env.FIRESTORE_HOST,
    ssl: process.env.FIRESTORE_SSL !== 'false',
  });
}

const store = new Container();
const adapter = new FirestoreAdapter({ db });

store.registerAdapter('firestore', adapter, { default: true });

export const clubMapper = store.defineMapper('club');
export const userMapper = store.defineMapper('user');

export { store };
