import { DMMF } from '@prisma/generator-helper';
import { camelCase } from '../utils';

export const genModule = (model: DMMF.Model) => {
  //const modelName = camelCase(model.name);

  return `import { Module } from '@nestjs/common'
    import { ${model.name}Service } from './${model.name}.service'
    import { ${model.name}Controller } from './${model.name}.controller'
    
    @Module({
      providers: [${model.name}Service],
      controllers: [${model.name}Controller],
      exports: [${model.name}Service],
    })
    export class ${model.name}Module {}
  `;
};
