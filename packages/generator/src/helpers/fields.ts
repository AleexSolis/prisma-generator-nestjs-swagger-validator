interface Field {
  kind: 'scalar' | 'object' | 'enum' | 'unsupported'
  name: string
  isRequired: boolean
  isList: boolean
  isUnique: boolean
  isId: boolean
  isReadOnly: boolean
  isGenerated?: boolean
  isUpdatedAt?: boolean
  type: string
  dbNames?: string[] | null
  hasDefaultValue: boolean
  default?:
    | {
        name: string
        args: any[]
      }
    | string
    | boolean
    | number
  relationFromFields?: string[]
  relationToFields?: any[]
  relationOnDelete?: string
  relationName?: string
  documentation?: string
  [key: string]: any
}

const NUMBER = ['Int']
const STRING = ['String']

const getType = (type: string): string => {
  if (NUMBER.includes(type)) {
    return 'number'
  } else if (STRING.includes(type)) {
    return 'string'
  }
  return 'any'
}

const getValidation = (type: string): string | undefined => {
  if (NUMBER.includes(type)) {
    return 'IsNumber'
  } else if (STRING.includes(type)) {
    return 'IsString'
  }
  return undefined
}

export function getField(field: Field) {
  let stringField = '@ApiProperty()\n'
  const type = getType(field.type)
  const validation = getValidation(field.type)
  if (validation) {
    stringField += `@${validation}()\n`
  }
  stringField += `${field.name}: ${type};`
  return stringField;
}

export function getImports(fields: Array<Field>) {
  const validations = new Set()
  fields.forEach((field) => validations.add(getValidation(field.type)))
  return `import {
        ${[...validations].join(',\n')}
      } from 'class-validator';
    `
}
