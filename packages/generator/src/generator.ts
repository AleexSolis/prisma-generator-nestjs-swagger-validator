import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { logger } from '@prisma/sdk';
import path from 'path';
import { GENERATOR_NAME } from './constants';
import { writeFileSafely } from './utils/writeFileSafely';
import { getField, getImports } from './helpers/fields';
import { genClass } from './helpers/genClasss';
import { isAnnotatedWith } from './helpers/annotations';

const { version } = require('../package.json');

async function generate({ dmmf, generator }: GeneratorOptions) {
  const dtos = dmmf.datamodel.models.map((table) => {
    const dtoCode = `import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
    ${getImports(table.fields)}
    export class ${table.name}Dto {
    ${table.fields
      .map((field) => {
        return getField(field);
      })
      .join('\n\n')}
    }
    
    export class Create${table.name}Dto extends OmitType(${
      table.name
    }Dto, ['id']) {}

    export class Update${table.name}Dto extends PartialType(${table.name}Dto) {}
    `;

    return {
      content: dtoCode,
      location: path.join(generator.output?.value!, `${table.name}.dto.ts`),
    };
  });

  const classes = dmmf.datamodel.models
    .map((table) => {
      if (!isAnnotatedWith(table, /crud/i)) return null;
      const classCode = genClass(table.name);
      return {
        content: classCode,
        location: path.join(generator.output?.value!, `${table.name}.ts`),
      };
    })
    .filter(Boolean) as { content: string; location: string }[];

  for (const element of [...dtos, ...classes]) {
    await writeFileSafely(element.location, element.content);
  }
}

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}:Registered`);
    return {
      version,
      defaultOutput: '../generated',
      prettyName: GENERATOR_NAME,
    };
  },
  onGenerate: generate,
});
