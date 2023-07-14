import { JsTypes, annotationDecorators, typeDecorators } from '../constants';
import { isAnnotatedWith } from '../helpers/annotations';
import { DecoratorObject, Field, FieldDtoPayload } from '../types';

const getValidation = (field: Field): DecoratorObject | null => {
  const { type, kind } = field;

  if (kind === 'enum') {
    return {
      decorator: `@IsEnum(${type})`,
      CVImport: 'IsEnum',
      prismaImport: type,
      apiPropertyProps: { enum: type },
    };
  }
  if (kind === 'object') {
    if (field.relationName) return null;
  }

  const decorator = typeDecorators[type as keyof typeof typeDecorators];
  if (!decorator) return null;

  return {
    decorator: `@${decorator}()`,
    CVImport: decorator,
  };
};

export function getField(field: Field): FieldDtoPayload | null {
  const decorators = new Set<string>();
  const classValidatorImports = new Set<string>();
  const prismaImports = new Set<string>();
  const dtoImports = new Set<string>();

  let apiPropertyProps = {};

  if (field.isRequired) {
    decorators.add('@IsNotEmpty()\n');
    decorators.add('@IsDefined()\n');
    classValidatorImports.add('IsNotEmpty');
    classValidatorImports.add('IsDefined');
  } else {
    decorators.add('@IsOptional()\n');
    Object.assign(apiPropertyProps, { required: false });
    classValidatorImports.add('IsOptional');
  }

  const typeDecorator = getValidation(field);

  if (typeDecorator) {
    const {
      decorator,
      CVImport,
      prismaImport,
      dtoImport,
      apiPropertyProps: apiProperties,
    } = typeDecorator;
    decorator && decorators.add(decorator);
    CVImport && classValidatorImports.add(CVImport);
    prismaImport && prismaImports.add(prismaImport);
    dtoImport && dtoImports.add(dtoImport);

    if (apiProperties) {
      Object.assign(apiPropertyProps, apiProperties);
    }
  } else {
    return null;
  }

  annotationDecorators.forEach((decorator) => {
    if (isAnnotatedWith(field, decorator.regexp)) {
      const result = decorator.handler(field);
      if (result.decorator) decorators.add(result.decorator);
      if (result.CVImport) classValidatorImports.add(result.CVImport);

      if (result.apiPropertyProps) {
        Object.assign(apiPropertyProps, result.apiPropertyProps);
      }
    }
  });

  const apiPropertyPropsString = JSON.stringify(apiPropertyProps)?.replace(
    /"enum":"([^"]+)"/g,
    'enum: $1',
  );

  decorators.add(`@ApiProperty(${apiPropertyPropsString})`);

  const stringField = `
    ${[...decorators].join('\n')}${field.name}${
    !field.isRequired ? '?' : ''
  }: ${JsTypes[field.type] || field.type};
  `;

  return {
    stringField,
    classValidatorImports: [...classValidatorImports],
    prismaImports: [...prismaImports],
    dtoImports: [...dtoImports],
  };
}

function getImportStatements(imports: Set<string>, importSource: string) {
  return imports.size > 0
    ? `
      import {
        ${[...imports].filter(Boolean).join(',\n')}
      } from '${importSource}';
      `
    : '';
}

export function getImports(fields: Array<Field>) {
  const prismaImports = new Set<string>();
  const CVImports = new Set<string>(['IsOptional', 'IsInt', 'IsPositive']);
  const dtoImports = new Set<string>();

  fields.forEach((field) => {
    const results = getField(field);
    if (!results) return;

    const {
      prismaImports: pi,
      classValidatorImports: cvi,
      dtoImports: di,
    } = results;

    cvi && cvi.forEach((cv) => CVImports.add(cv));
    pi && pi.forEach((pi) => prismaImports.add(pi));
    di && di.forEach((di) => dtoImports.add(di));
  });

  const CVImportStatements = getImportStatements(CVImports, 'class-validator');
  const prismaImportStatements = getImportStatements(
    prismaImports,
    '@prisma/client',
  );
  const dtoImportStatements =
    dtoImports.size > 0
      ? `import { ${[...dtoImports].join(', ')} } from '.';`
      : '';

  return `
    ${CVImportStatements}
    ${prismaImportStatements}
    ${dtoImportStatements}
  `;
}
