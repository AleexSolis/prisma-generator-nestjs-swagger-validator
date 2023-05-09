import { annotationDecorators } from '../constants';
import { isAnnotatedWith } from './annotations';

export interface Field {
  kind: 'scalar' | 'object' | 'enum' | 'unsupported';
  name: string;
  isRequired: boolean;
  isList: boolean;
  isUnique: boolean;
  isId: boolean;
  isReadOnly: boolean;
  isGenerated?: boolean;
  isUpdatedAt?: boolean;
  type: string;
  dbNames?: string[] | null;
  hasDefaultValue: boolean;
  default?:
    | {
        name: string;
        args: any[];
      }
    | string
    | boolean
    | number;
  relationFromFields?: string[];
  relationToFields?: any[];
  relationOnDelete?: string;
  relationName?: string;
  documentation?: string;
  [key: string]: any;
}

const NUMBER = ['Int'];
const STRING = ['String'];

const getType = (type: string): string => {
  if (NUMBER.includes(type)) {
    return 'number';
  } else if (STRING.includes(type)) {
    return 'string';
  }
  return 'any';
};

const getValidation = (type: string): string | undefined => {
  if (NUMBER.includes(type)) {
    return 'IsNumber';
  } else if (STRING.includes(type)) {
    return 'IsString';
  }
  return undefined;
};

export function getField(field: Field) {
  const decorators = [];
  const classValidatorImports = [];
  let apiPropertyProps = {};

  const type = getType(field.type);
  const validation = getValidation(field.type);

  if (validation) {
    decorators.push(`@${validation}()\n`);
  }

  if (field.isRequired) {
    decorators.push('@IsNotEmpty()\n');
    decorators.push('@IsDefined()\n');
  } else {
    decorators.push('@IsOptional()\n');
    apiPropertyProps = { ...apiPropertyProps, required: false };
  }

  annotationDecorators.forEach((decorator) => {
    if (isAnnotatedWith(field, decorator.regexp)) {
      const result = decorator.handler(field);
      decorators.push(result.decorator);
      if (result.import) {
        classValidatorImports.push(result.import);
      }
      if (result.apiPropertyProps) {
        apiPropertyProps = { ...apiPropertyProps, ...result.apiPropertyProps };
      }
    }
  });

  decorators.push(`@ApiProperty(${JSON.stringify(apiPropertyProps)})`);

  const stringField = decorators.join('\n') + `${field.name}: ${type};`;
  return stringField;
}

export function getImports(fields: Array<Field>) {
  const validations = new Set();
  fields.forEach((field) => validations.add(getValidation(field.type)));
  return `import {
        ${[...validations].join(',\n')}
      } from '@nestjs/class-validator';
    `;
}
