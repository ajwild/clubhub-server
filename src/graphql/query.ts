import { objectType } from '@nexus/schema';

import { clubQuery } from './models/club';
import { userQuery } from './models/user';
import { DefinitionBlock } from '../types';

export const Query = objectType({
  name: 'Query',
  definition(t: DefinitionBlock<'Query'>): DefinitionBlock<'Query'> {
    /* eslint-disable functional/no-expression-statement */
    clubQuery(t);
    userQuery(t);
    /* eslint-enable functional/no-expression-statement */

    return t;
  },
});
