import path from 'path';
import { logger } from '@prisma/sdk';
import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper';
import { GENERATOR_NAME } from './constants';
import { writeFileSafely, writeBarrelFile } from './utils';
import { isAnnotatedWith } from './helpers';
import {
  genService,
  genController,
  genDto,
  genModule,
  handleGenPrismaModule,
} from './generators';
import { fileToWrite, Config } from './types';

const { version } = require('../package.json');

async function generate({ dmmf, generator }: GeneratorOptions) {
  const config = generator.config as Config;
  const isModule = config.modules;

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
      const classCode = genService(table.name);
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
      const moduleCode = genModule(table);
      return {
        content: moduleCode,
        location: path.join(
          generator.output?.value! + (isModule ? '/' + table.name : ''),
          `${table.name}.module.ts`,
        ),
      };
    })
    .filter(Boolean) as fileToWrite[];

  const prismaFiles = isModule
    ? handleGenPrismaModule(generator.output?.value!)
    : [];

  for (const element of [
    ...dtos,
    ...services,
    ...controllers,
    ...modules,
    ...prismaFiles,
  ]) {
    await writeFileSafely({
      content: element.content,
      writeLocation: element.location,
      preventOverWrite: config.preventOverwrite,
      baseOutput: generator.output?.value!,
    });
  }

  if (isModule) return;

  await writeBarrelFile(
    path.join(generator.output?.value!, 'index.ts'),
    [...dtos, ...services, ...controllers, ...prismaFiles].map(
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
