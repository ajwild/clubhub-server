/* eslint-disable functional/no-expression-statement */

import { Firestore } from '@google-cloud/firestore';
import { Container } from 'js-data';

import { FirestoreAdapter } from './js-data-firestore';
import { clubSchema } from './schemas/club';
import { userSchema } from './schemas/user';

const db = new Firestore();
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

const clubService = store.defineMapper('club', { schema: clubSchema });
const userService = store.defineMapper('user', { schema: userSchema });

export { db, store, clubSchema, clubService, userSchema, userService };
