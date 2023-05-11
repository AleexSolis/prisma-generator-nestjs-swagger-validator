import { IAnnotationDecorator } from './types';

export const GENERATOR_NAME = 'prisma-generator-nestjs-swagger-validator';

export const annotationDecorators: IAnnotationDecorator[] = [
  {
    regexp: /email/,
    handler: () => ({
      decorator: '@IsEmail()',
      CVImport: 'IsEmail',
      apiPropertyProps: { type: 'string', format: 'email' },
    }),
  },
  {
    regexp: /length \(\d+,\d+\)/,
    handler: (field) => {
      const length = field.documentation?.match(/length \((\d+),(\d+)\)/);
      const min = length?.[1];
      const max = length?.[2];
      return {
        decorator: `@Length(${min}, ${max})`,
        CVImport: 'Length',
        apiPropertyProps: { minLength: min, maxLength: max },
      };
    },
  },
  {
    regexp: /readonly/,
    handler: () => ({
      decorator: '@ReadOnly()',
      apiPropertyProps: { readOnly: true },
    }),
  },
  {
    regexp: /positive/i,
    handler: (field) => ({
      decorator: '@IsPositive()',
      CVImport: 'IsPositive',
      apiPropertyProps: { minimum: 0 },
    }),
  },
];

export const typeDecorators = {
  String: 'IsString',
  Boolean: 'IsBoolean',
  Int: 'IsInt',
  BigInt: 'IsInt',
  Float: 'IsNumber',
  Decimal: 'IsNumber',
  DateTime: 'IsDate',
  Json: 'IsJSON',
  Bytes: 'String',
};

export const JsTypes = {
  String: 'string',
  Boolean: 'boolean',
  Int: 'number',
  BigInt: 'number',
  Float: 'number',
  Decimal: 'number',
  DateTime: 'Date',
  Json: 'object',
  Bytes: 'string',
};
