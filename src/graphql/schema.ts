import { schema } from 'nexus';

import { clubObject } from './models/club';
import { userObject } from './models/user';

export const club = schema.objectType(clubObject);
export const user = schema.objectType(userObject);
