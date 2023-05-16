import { DecoratorObject, Field } from '../types';
import { JsTypes, annotationDecorators, typeDecorators } from '../constants';
import { isAnnotatedWith } from './annotations';

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
    return {
      decorator: `@IsObject()`,
      CVImport: 'IsObject',
      apiPropertyProps: { type: `${type}Dto` },
      dtoImport: `${type}Dto`,
    };
  }

  const decorator = typeDecorators[type as keyof typeof typeDecorators];
  if (!decorator) return null;

  return {
    decorator: `@${decorator}()`,
    CVImport: decorator,
  };
};

export function getField(field: Field) {
  const decorators = new Set<String>();
  const classValidatorImports = new Set<String>();
  const prismaImports = new Set<String>();
  const dtoImports = new Set<String>();

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
    typeDecorator.dtoImport && dtoImports.add(typeDecorator.dtoImport);

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
    dtoImports: [...dtoImports],
  };
}

export function getImports(fields: Array<Field>) {
  const prismaImports = new Set<String>();
  const CVImports = new Set<String>();
  const dtoImports = new Set<String>();

  fields.forEach((field) => {
    const {
      prismaImports: pi,
      classValidatorImports: cvi,
      dtoImports: di,
    } = getField(field);
    cvi.forEach((cv) => CVImports.add(cv));
    pi.forEach((pi) => prismaImports.add(pi));
    di.forEach((di) => dtoImports.add(di));
  });

  return `import {
        ${[...CVImports].filter(Boolean).join(',\n')}
      } from 'class-validator';
      import {
        ${[...prismaImports].filter(Boolean).join(',\n')}
      } from '@prisma/client';
      ${
        dtoImports.size > 0 &&
        `import { ${[...dtoImports].join(', ')} } from '.';`
      }
    `;
}
