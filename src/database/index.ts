import { Firestore } from '@google-cloud/firestore';
import setupClubService from './models/club';
import setupUserService from './models/user';

const db = new Firestore();
// eslint-disable-next-line functional/no-conditional-statement
if (process.env.FIRESTORE_HOST) {
  // eslint-disable-next-line functional/no-expression-statement
  db.settings({
    host: process.env.FIRESTORE_HOST,
    ssl: process.env.FIRESTORE_SSL !== 'false',
  });
}

const clubService = setupClubService(db);
const userService = setupUserService(db);

export { db, clubService, userService };
