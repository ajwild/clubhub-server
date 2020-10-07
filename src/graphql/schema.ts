import { makeSchema } from '@nexus/schema';
import path from 'path';

import { Query } from './query';
import { Mutation } from './mutation';
import { Club } from './models/club';
import { User } from './models/user';

export const schema = makeSchema({
  types: [Query, Mutation, Club, User],
  outputs: {
    schema: path.resolve('schema.graphql'),
    typegen: path.resolve('src/generated/nexus.ts'),
  },
});
