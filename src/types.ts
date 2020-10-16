import { core } from '@nexus/schema';
import { DeepReadonly } from 'ts-essentials';

export enum Collections {
  Club = 'Club',
  User = 'User',
}

export type DefinitionBlock<TypeName extends string> = DeepReadonly<
  core.ObjectDefinitionBlock<TypeName>
>;

export type MinimalSchema = {
  readonly id: string | null;
};

export type SchemaPropertyType = 'boolean' | 'float' | 'id' | 'int' | 'string';
export type SchemaPropertySettings = {
  readonly type: SchemaPropertyType;
  readonly required?: boolean;
};
export type Schema =
  | {
      readonly id: SchemaPropertySettings;
    }
  | {
      readonly [field: string]: SchemaPropertySettings;
    };

export type UpdateArgs<S> = { readonly id: string } & Partial<S>;
