import { Firestore } from '@google-cloud/firestore';
import { DeepReadonly } from 'ts-essentials';

import { setupDefaultFunctions } from './shared';

const setupClubService = (
  db: DeepReadonly<Firestore>
): ReturnType<typeof setupDefaultFunctions> => {
  const userCollection = db.collection('user');

  return {
    ...setupDefaultFunctions(userCollection),
  };
};

export default setupClubService;
