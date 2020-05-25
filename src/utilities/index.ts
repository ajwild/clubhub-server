type Options = {
  readonly properties: {
    readonly [key: string]: {
      readonly type: string;
    };
  };
  readonly required: readonly string[];
};

export function convertSchemaToDefinition({ properties, required }: Options) {
  return function (t): typeof t {
    /* eslint-disable functional/no-expression-statement */
    Object.keys(properties).forEach((property) => {
      const type = property === 'id' ? property : properties[property].type;
      const options = { nullable: !required.includes(property) };
      t[type](property, options);
    });
    /* eslint-enable functional/no-expression-statement */

    return t;
  };
}
