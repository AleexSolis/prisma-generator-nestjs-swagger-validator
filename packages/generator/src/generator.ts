import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { logger } from '@prisma/sdk';
import path from 'path';
import { GENERATOR_NAME } from './constants';
import { writeFileSafely } from './utils/writeFileSafely';
import {
  genClass,
  isAnnotatedWith,
  genController,
  genDto,
  generateModule,
} from './helpers';
import { fileToWrite } from './types';
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
      if (!isAnnotatedWith(table, /crud/i) || !isModule) return null;
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
      if (!isAnnotatedWith(table, /crud/i) || !isModule) return null;
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

  const modules = dmmf.datamodel.models
    .map((table) => {
      if (!isAnnotatedWith(table, /crud/i) || !isModule) return null;
      const moduleCode = generateModule(table);
      return {
        content: moduleCode,
        location: path.join(
          generator.output?.value! + (isModule ? '/' + table.name : ''),
          `${table.name}.module.ts`,
        ),
      };
    })
    .filter(Boolean) as fileToWrite[];

  for (const element of [...dtos, ...services, ...controllers, ...modules]) {
    await writeFileSafely(element.location, element.content);
  }

  if (isModule) return;

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
