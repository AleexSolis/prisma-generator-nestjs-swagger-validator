import { DMMF } from '@prisma/generator-helper';
import { camelCase } from './';

export const generateModule = (model: DMMF.Model) => {
  const modelName = camelCase(model.name);

  return `import { Module } from '@nestjs/common'
    import { ${model.name}Service } from './${modelName}.service'
    import { ${model.name}Controller } from './${modelName}.controller'
    
    @Module({
      providers: [${model.name}Service],
      controllers: [${model.name}Controller],
      exports: [${model.name}Service],
    })
    export class ${model.name}Module {}
  `;
};
