import { objectType } from '@nexus/schema';

import { clubMutation } from './models/club';
import { userMutation } from './models/user';
import { DefinitionBlock } from '../types';

export const Mutation = objectType({
  name: 'Mutation',
  definition(t: DefinitionBlock<'Mutation'>): DefinitionBlock<'Mutation'> {
    /* eslint-disable functional/no-expression-statement */
    clubMutation(t);
    userMutation(t);
    /* eslint-enable functional/no-expression-statement */

    return t;
  },
});
