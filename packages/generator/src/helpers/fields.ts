import { DecoratorObject, Field } from '../types';
import { JsTypes, annotationDecorators, typeDecorators } from '../constants';
import { isAnnotatedWith } from './annotations';

const getValidation = (field: Field): DecoratorObject => {
  const { type, kind } = field;

  if (kind === 'enum') {
    return {
      decorator: `@IsEnum(${type})`,
      CVImport: 'IsEnum',
      prismaImport: type,
      apiPropertyProps: { enum: type },
    };
  }

  const decorator = typeDecorators[type as keyof typeof typeDecorators];
  return {
    decorator: `@${decorator}()`,
    CVImport: decorator,
  };
};

export function getField(field: Field) {
  const decorators = new Set<String>();
  const classValidatorImports = new Set<String>();
  const prismaImports = new Set<String>();

  let apiPropertyProps = {};

  if (field.isRequired) {
    decorators.add('@IsNotEmpty()\n');
    decorators.add('@IsDefined()\n');
    classValidatorImports.add('IsNotEmpty');
    classValidatorImports.add('IsDefined');
  } else {
    decorators.add('@IsOptional()\n');
    apiPropertyProps = { ...apiPropertyProps, required: false };
    classValidatorImports.add('IsOptional');
  }

  const typeDecorator = getValidation(field);

  if (typeDecorator) {
    decorators.add(typeDecorator.decorator);
    typeDecorator.CVImport && classValidatorImports.add(typeDecorator.CVImport);
    typeDecorator.prismaImport && prismaImports.add(typeDecorator.prismaImport);
    if (typeDecorator.apiPropertyProps)
      apiPropertyProps = {
        ...apiPropertyProps,
        ...typeDecorator.apiPropertyProps,
      };
  }

  annotationDecorators.forEach((decorator) => {
    if (isAnnotatedWith(field, decorator.regexp)) {
      const result = decorator.handler(field);
      decorators.add(result.decorator);
      if (result.CVImport) {
        classValidatorImports.add(result.CVImport);
      }
      if (result.apiPropertyProps) {
        apiPropertyProps = { ...apiPropertyProps, ...result.apiPropertyProps };
      }
    }
  });

  const apiPropertyPropsString = JSON.stringify(apiPropertyProps)?.replace(
    /"enum":"([^"]+)"/g,
    'enum: $1',
  );

  decorators.add(`@ApiProperty(${apiPropertyPropsString})`);

  const stringField =
    [...decorators].join('\n') +
    `${field.name}${!field.isRequired ? '?' : ''}: ${
      JsTypes[field.type as keyof typeof JsTypes] || field.type
    };`;

  return {
    stringField,
    classValidatorImports: [...classValidatorImports],
    prismaImports: [...prismaImports],
  };
}

export function getImports(fields: Array<Field>) {
  const prismaImports = new Set<String>();
  const CVImports = new Set<String>();

  fields.forEach((field) => {
    const { prismaImports: pi, classValidatorImports: cvi } = getField(field);
    prismaImports.add(...pi);
    CVImports.add(...cvi);
  });

  return `import {
        ${[...CVImports].filter(Boolean).join(',\n')}
      } from 'class-validator';
      import {
        ${[...prismaImports].filter(Boolean).join(',\n')}
      } from '@prisma/client';
    `;
}
