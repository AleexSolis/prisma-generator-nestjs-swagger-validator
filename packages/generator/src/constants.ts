import { Field } from './helpers/fields';

export const GENERATOR_NAME = 'prisma-generator-nestjs-swagger-validator';

interface IAnnotationDecorator {
  regexp: RegExp;
  handler: (field: Field) => {
    decorator: string;
    import?: string;
    apiPropertyProps: Object;
  };
}

export const annotationDecorators: IAnnotationDecorator[] = [
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
