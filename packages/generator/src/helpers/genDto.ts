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
