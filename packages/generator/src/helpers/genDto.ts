import { DMMF } from '@prisma/generator-helper';
import { getField, getImports } from './fields';
import { isAnnotatedWith } from './annotations';

export const genDto = (
  table: DMMF.Model,
) => `import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
${getImports(table.fields)}
export class ${table.name}Dto {
${tableFields(table)}
}

export class Create${table.name}Dto extends OmitType(${
  table.name
}Dto, [${createOmiyType(table)}]) {}

export class Update${table.name}Dto extends PartialType(
  OmitType(${table.name}Dto, [${updateOmitType(table)}])
) {}

class WhereDto{
  ${filterFields(table)}
}

class OrderDto{
  ${orderFields(table)}
}

export class Filter${table.name}Dto {
  @ApiProperty({ required: false })
  where?: WhereDto;

  @ApiProperty({ required: false })
  order?: OrderDto;

  @ApiProperty({ required: false })
  skip?: number;

  @ApiProperty({ required: false })
  take?: number;
}
`;

const tableFields = (table: DMMF.Model) =>
  table.fields
    .map((field) => {
      return getField(field)?.stringField;
    })
    .filter(Boolean)
    .join('\n\n');

const createOmiyType = (table: DMMF.Model) =>
  table.fields
    .filter(
      (f) =>
        f.isId ||
        f.isGenerated ||
        f.isReadOnly ||
        isAnnotatedWith(f, /readonly/i),
    )
    .map((f) => `'${f.name}'`)
    .join(',');

const updateOmitType = (table: DMMF.Model) =>
  table.fields
    .filter(
      (f) =>
        f.isId ||
        f.isGenerated ||
        f.isReadOnly ||
        isAnnotatedWith(f, /readonly/i),
    )
    .map((f) => `'${f.name}'`)
    .join(',');

const filterFields = (table: DMMF.Model) =>
  table.fields
    .map((field) => {
      if (!isAnnotatedWith(field, /canFilter/i)) return null;
      return `
        @ApiProperty({ required: false })
        ${field.name}?: ${field.type};
      `;
    })
    .filter(Boolean)
    .join('\n\n');

const orderFields = (table: DMMF.Model) =>
  table.fields
    .map((field) => {
      if (!isAnnotatedWith(field, /canOrder/i)) return null;
      return `
        @ApiProperty({ required: false, enum: ['asc', 'desc'], default: 'asc' })
        ${field.name}?: 'asc' | 'desc';
      `;
    })
    .filter(Boolean)
    .join('\n\n');
