import { DefinitionBlock, Schema, SchemaPropertySettings } from '../types';

export function convertSchemaToDefinition<
  TypeName extends string,
  CustomSchema
>(schema: Schema) {
  return function (t: DefinitionBlock<TypeName>): DefinitionBlock<TypeName> {
    /* eslint-disable functional/no-expression-statement */
    Object.entries(schema).forEach(
      ([propertyName, propertySettings]: Readonly<
        readonly [string, SchemaPropertySettings]
      >) => {
        const options = { nullable: !propertySettings.required };
        // @ts-ignore: The nullable option should be valid!
        t[propertySettings.type](propertyName, options);
      }
    );
    /* eslint-enable functional/no-expression-statement */

    return t;
  };
}
