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

export interface DecoratorObject {
  decorator?: string;
  apiPropertyProps?: Object;
  CVImport?: string;
  prismaImport?: string;
  dtoImport?: string;
}

export interface IAnnotationDecorator {
  regexp: RegExp;
  handler: (field: Field) => DecoratorObject;
}

export interface fileToWrite {
  content: string;
  location: string;
}

export interface FieldDtoPayload {
  stringField: string;
  classValidatorImports: string[];
  prismaImports: string[];
  dtoImports: string[];
}
