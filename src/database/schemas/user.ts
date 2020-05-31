import { Schema } from 'js-data';

export const userSchema: Partial<Schema> = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    description: { type: 'string' },
  },
  required: ['name'],
};
