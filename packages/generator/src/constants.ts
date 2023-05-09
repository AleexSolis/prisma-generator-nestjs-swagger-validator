import { DMMF } from '@prisma/generator-helper';
import { Field } from './helpers/fields';

export const GENERATOR_NAME = 'prisma-generator-nestjs-swagger-validator';

export const AnnotationDecorators: {
  regexp: RegExp;
  handler: (field: Field) => {
    decorator: string;
    import?: string;
    apiPropertyProps: Object;
  };
}[] = [
  {
    regexp: /email/,
    handler: () => ({
      decorator: '@IsEmail()',
      import: 'IsEmail',
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
        import: 'Length',
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
];
