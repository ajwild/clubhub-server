import { Schema } from '../types';

export type ClubDatabaseSchema = {
  readonly id: string | null;
  readonly description?: string | null;
  readonly location: string | null;
  readonly name: string | null;
  readonly slug: string | null;
  readonly website?: string | null;
};

export const clubGraphqlSchema: Schema = {
  id: { type: 'id' },
  description: { type: 'string' },
  location: { type: 'string' },
  name: { type: 'string' },
  slug: { type: 'string' },
  website: { type: 'string' },
};
