import { Schema } from '../types';

export const userGraphqlSchema: Schema = {
  id: { type: 'id' },
  name: { type: 'string' },
  description: { type: 'string' },
};

export type UserDatabaseSchema = {
  readonly id: string | null;
  readonly description?: string | null;
  readonly name: string | null;
};
