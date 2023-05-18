import { DMMF } from '@prisma/generator-helper';
import { getField, getImports } from './fields';

export const genDto = (
  table: DMMF.Model,
) => `import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
${getImports(table.fields)}
export class ${table.name}Dto {
${table.fields
  .map((field) => {
    return getField(field)?.stringField;
  })
  .filter(Boolean)
  .join('\n\n')}
}

export class Create${table.name}Dto extends OmitType(${
  table.name
}Dto, ['id']) {}

export class Update${table.name}Dto extends PartialType(${table.name}Dto) {}
`;
