export const genController = (modelName: string): string => {
  const modelNameLower = modelName.toLowerCase();
  return `
        import { Controller, Get, Post, Body, Patch, Param, Delete, Res } from '@nestjs/common';
        import { ApiResponse, ApiTags } from '@nestjs/swagger';
        import { Response } from 'express';
        import { ${modelName}Service } from './${modelName}.service';
        import { Create${modelName}Dto, Update${modelName}Dto, ${modelName}Dto } from './${modelName}.dto';

        @ApiTags('${modelNameLower}')
        @Controller('${modelNameLower}')
        export class ${modelName}Controller {
        constructor(private readonly ${modelNameLower}Service: ${modelName}Service) {}

        @ApiResponse({ type: ${modelName}Dto, status: 201 })
        @Post()
        async create(@Res() res: Response, @Body() create${modelName}Dto: Create${modelName}Dto) {
            const data = this.${modelNameLower}Service.create(create${modelName}Dto);
            res.send(data);
        }

        @ApiResponse({ type: ${modelName}Dto, status: 200, isArray: true })
        @Get()
        find() {
            return this.${modelNameLower}Service.find({});
        }

        @ApiResponse({ type: ${modelName}Dto, status: 200 })
        @Get(':id')
        findOne(@Param('id') id: string) {
            return this.${modelNameLower}Service.findOne({ id: id });
        }

        @ApiResponse({ type: ${modelName}Dto, status: 200 })
        @Patch(':id')
        update(@Param('id') id: string, @Body() update${modelName}Dto: Update${modelName}Dto) {
            return this.${modelNameLower}Service.update({id: id}, update${modelName}Dto);
        }

        @ApiResponse({ type: ${modelName}Dto, status: 200 })
        @Delete(':id')
        delete(@Param('id') id: string) {
            return this.${modelNameLower}Service.delete({id: id});
        }
        }
        `;
};
