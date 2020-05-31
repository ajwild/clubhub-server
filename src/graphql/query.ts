import { schema } from 'nexus';

import { clubQuery } from './models/club';
import { userQuery } from './models/user';
import { DefinitionBlock } from '../types';

export const query = schema.queryType({
  definition(t: DefinitionBlock<'Query'>): DefinitionBlock<'Query'> {
    /* eslint-disable functional/no-expression-statement */
    clubQuery(t);
    userQuery(t);
    /* eslint-enable functional/no-expression-statement */

    return t;
  },
});
