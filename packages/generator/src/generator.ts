import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { logger } from '@prisma/sdk';
import path from 'path';
import { GENERATOR_NAME } from './constants';
import { writeFileSafely } from './utils/writeFileSafely';
import { genClass } from './helpers/genClasss';
import { isAnnotatedWith } from './helpers/annotations';
import { genController } from './helpers/genController';
import { fileToWrite } from './types';
import { genDto } from './helpers/genDto';
import { writeBarrelFile } from './utils/writeBarrelFile';

const { version } = require('../package.json');

async function generate({ dmmf, generator }: GeneratorOptions) {
  const isModule = Boolean(generator.config.modules);

  const dtos = dmmf.datamodel.models
    .map((table) => {
      if (isAnnotatedWith(table, /skip/i)) return null;
      const dtoCode = genDto(table);

      return {
        content: dtoCode,
        location: path.join(
          generator.output?.value! + (isModule ? '/' + table.name : ''),
          `${table.name}.dto.ts`,
        ),
      };
    })
    .filter(Boolean) as fileToWrite[];

  const services = dmmf.datamodel.models
    .map((table) => {
      if (!isAnnotatedWith(table, /crud/i)) return null;
      const classCode = genClass(table.name);
      return {
        content: classCode,
        location: path.join(
          generator.output?.value! + (isModule ? '/' + table.name : ''),
          `${table.name}.service.ts`,
        ),
      };
    })
    .filter(Boolean) as fileToWrite[];

  const controllers = dmmf.datamodel.models
    .map((table) => {
      if (!isAnnotatedWith(table, /crud/i)) return null;
      const controllerCode = genController(table.name);
      return {
        content: controllerCode,
        location: path.join(
          generator.output?.value! + (isModule ? '/' + table.name : ''),
          `${table.name}.controller.ts`,
        ),
      };
    })
    .filter(Boolean) as fileToWrite[];

  for (const element of [...dtos, ...services, ...controllers]) {
    await writeFileSafely(element.location, element.content);
  }

  await writeBarrelFile(
    path.join(generator.output?.value!, 'index.ts'),
    [...dtos, ...services, ...controllers].map(
      (file) => file.location.split('/').pop()!,
    ),
  );
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
