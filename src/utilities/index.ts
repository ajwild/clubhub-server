import { Schema } from 'js-data';

import { DefinitionBlock, SchemaPropertyType } from '../types';

export function convertSchemaToDefinition<TypeName extends string>({
  properties,
  required,
}: Readonly<Partial<Schema>>) {
  return function (t: DefinitionBlock<TypeName>): DefinitionBlock<TypeName> {
    /* eslint-disable functional/no-expression-statement */
    Object.keys(properties).forEach((property) => {
      const type: SchemaPropertyType =
        property === 'id' ? property : properties[property].type;
      const options = { nullable: !required.includes(property) };
      // @ts-ignore: Not sure why it's complaining about nullable in options
      t[type](property, options);
    });
    /* eslint-enable functional/no-expression-statement */

    return t;
  };
}
