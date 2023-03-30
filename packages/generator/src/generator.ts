import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper'
import { logger } from '@prisma/sdk'
import path from 'path'
import { GENERATOR_NAME } from './constants'
import { writeFileSafely } from './utils/writeFileSafely'
import { getField, getImports } from './helpers/fields'
import { genClass } from './helpers/genClasss'

const { version } = require('../package.json')

async function generate({ dmmf, generator }: GeneratorOptions) {
  const dtos = dmmf.datamodel.models.map((table) => {
    const dtoCode = `import { ApiProperty } from '@nestjs/swagger';
    ${getImports(table.fields)}
    export class ${table.name}Dto {
    ${table.fields.map((field) => getField(field)).join('\n\n')}
    }`

    return {
      content: dtoCode,
      location: path.join(generator.output?.value!, `${table.name}.dto.ts`),
    }
  })

  const classes = dmmf.datamodel.models.map((table) => {
    const classCode = genClass(table.name)
    return {
      content: classCode,
      location: path.join(generator.output?.value!, `${table.name}.ts`),
    }
  })

  for (const element of [...dtos, ...classes]) {
    await writeFileSafely(element.location, element.content)
  }
}

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}:Registered`)
    return {
      version,
      defaultOutput: '../generated',
      prettyName: GENERATOR_NAME,
    }
  },
  onGenerate: generate,
})
