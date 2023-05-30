import { IAnnotationDecorator } from './types';
import { formatDate } from './utils';

export const GENERATOR_NAME = 'prisma-generator-nestjs-swagger-validator';

export const annotationDecorators: IAnnotationDecorator[] = [
  {
    regexp: /readonly/,
    handler: () => ({
      apiPropertyProps: { readOnly: true },
    }),
  },
  // string
  {
    regexp: /booleanString/i,
    handler: () => ({
      decorator: '@IsBooleanString()',
      CVImport: 'IsBooleanString',
      apiPropertyProps: { type: 'string', format: 'boolean' },
    }),
  },
  {
    regexp: /dateString/i,
    handler: () => ({
      decorator: '@IsDateString()',
      CVImport: 'IsDateString',
      apiPropertyProps: { type: 'string', format: 'date-time' },
    }),
  },
  {
    regexp: /numberString/i,
    handler: () => ({
      decorator: '@IsNumberString()',
      CVImport: 'IsNumberString',
      apiPropertyProps: { type: 'string', format: 'number' },
    }),
  },
  {
    regexp: /contains\(.*\)/,
    handler: (field) => {
      const contains = field.documentation?.match(/contains\((.*)\)/);
      const seed = contains?.[1];
      return {
        decorator: `@Contains("${seed}")`,
        CVImport: 'Contains',
      };
    },
  },
  {
    regexp: /notContains\(.*\)/,
    handler: (field) => {
      const notContains = field.documentation?.match(/notContains\((.*)\)/);
      const seed = notContains?.[1];
      return {
        decorator: `@NotContains("${seed}")`,
        CVImport: 'NotContains',
      };
    },
  },
  {
    regexp: /alpha/,
    handler: () => ({
      decorator: '@IsAlpha()',
      CVImport: 'IsAlpha',
    }),
  },
  {
    regexp: /base64/,
    handler: () => ({
      decorator: '@IsBase64()',
      CVImport: 'IsBase64',
    }),
  },
  {
    regexp: /email/,
    handler: () => ({
      decorator: '@IsEmail()',
      CVImport: 'IsEmail',
      apiPropertyProps: { type: 'string', format: 'email' },
    }),
  },
  {
    regexp: /creditCard/,
    handler: () => ({
      decorator: '@IsCreditCard()',
      CVImport: 'IsCreditCard',
    }),
  },
  {
    regexp: /Json/i,
    handler: () => ({
      decorator: '@IsJSON()',
      CVImport: 'IsJSON',
      apiPropertyProps: { type: 'object' },
    }),
  },
  {
    regexp: /phoneNumber/i,
    handler: () => ({
      decorator: '@IsPhoneNumber()',
      CVImport: 'IsPhoneNumber',
    }),
  },
  {
    regexp: /mongoId/i,
    handler: () => ({
      decorator: '@IsMongoId()',
      CVImport: 'IsMongoId',
    }),
  },
  {
    regexp: /url/i,
    handler: () => ({
      decorator: '@IsUrl()',
      CVImport: 'IsUrl',
    }),
  },
  {
    regexp: /uuid(\d)?/i,
    handler: (field) => {
      const uuid = field.documentation?.match(/uuid(\d)?/i);
      const version = uuid?.[1];
      return {
        decorator: `@IsUUID(${version ? version : ''})`,
        CVImport: 'IsUUID',
      };
    },
  },
  {
    regexp: /length\(\d+,\d+\)/,
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
    regexp: /matches\(.*\)/,
    handler: (field) => {
      const matches = field.documentation?.match(/matches\((.*)\)/);
      const regex = matches?.[1];
      return {
        decorator: `@Matches(${regex})`,
        CVImport: 'Matches',
      };
    },
  },
  {
    regexp: /timezone/i,
    handler: () => ({
      decorator: '@IsTimeZone()',
      CVImport: 'IsTimeZone',
    }),
  },
  // number
  {
    regexp: /isDivisibleBy/i,
    handler: (field) => {
      const contains = field.documentation?.match(/isDivisibleBy\((.*)\)/);
      const num = contains?.[1];
      return {
        decorator: `@IsDivisibleBy(${num})`,
        CVImport: 'IsDivisibleBy',
      };
    },
  },
  {
    regexp: /isPositive/i,
    handler: () => ({
      decorator: '@IsPositive()',
      CVImport: 'IsPositive',
      apiPropertyProps: { minimum: 0 },
    }),
  },
  {
    regexp: /isNegative/i,
    handler: () => ({
      decorator: '@IsNegative()',
      CVImport: 'IsNegative',
    }),
  },
  {
    regexp: /min/i,
    handler: (field) => {
      const contains = field.documentation?.match(/min\((.*)\)/);
      const num = Number(contains?.[1]);
      return {
        decorator: `@Min(${num})`,
        CVImport: 'Min',
        apiPropertyProps: { minimum: num },
      };
    },
  },
  {
    regexp: /max/i,
    handler: (field) => {
      const contains = field.documentation?.match(/max\((.*)\)/);
      const num = Number(contains?.[1]);
      return {
        decorator: `@Max(${num})`,
        CVImport: 'Max',
        apiPropertyProps: { maximum: num },
      };
    },
  },
  {
    regexp: /minDate/i,
    handler: (field) => {
      const date = formatDate(field);
      return {
        decorator: `@MinDate("${date}")`,
        CVImport: 'MinDate',
        apiPropertyProps: { minDate: date },
      };
    },
  },
  {
    regexp: /maxDate/i,
    handler: (field) => {
      const date = formatDate(field);
      return {
        decorator: `@MaxDate("${date}")`,
        CVImport: 'MaxDate',
        apiPropertyProps: { maxDate: date },
      };
    },
  },
  {
    regexp: /isInstance/i,
    handler: (field) => {
      const contains = field.documentation?.match(/isInstance\((.*)\)/);
      const isInstance = contains && contains[1];
      return {
        decorator: `@IsInstance(${isInstance})`,
        CVImport: 'IsInstance',
      };
    },
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
