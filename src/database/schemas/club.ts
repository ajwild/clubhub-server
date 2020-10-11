import { Schema } from 'js-data';

export const clubSchema: Partial<Schema> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    description: { type: 'string' },
    location: { type: 'string' },
    name: { type: 'string' },
    website: { type: 'string' },
  },
  required: ['location', 'name'],
};
