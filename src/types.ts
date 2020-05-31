import { core } from '@nexus/schema';
import { DeepReadonly } from 'ts-essentials';

export enum Collections {
  Club = 'Club',
  User = 'User',
}

export type DefinitionBlock<TypeName extends string> = DeepReadonly<
  core.ObjectDefinitionBlock<TypeName>
>;

export type SchemaPropertyType = 'boolean' | 'float' | 'id' | 'int' | 'string';
