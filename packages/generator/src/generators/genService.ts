export const genService = (modelName: string): string => {
  const modelNameLower = modelName[0].toLowerCase() + modelName.slice(1);

  return `
      import { Injectable } from '@nestjs/common';
      import { Prisma } from '@prisma/client';
      import { PrismaService } from '../prisma/prisma.service';

      @Injectable()
      export class ${modelName}Service{
  
          constructor(private prisma: PrismaService){}
  
          create(data: Prisma.${modelName}CreateInput) {
            return this.prisma.${modelNameLower}.create({ data });
          }
          
          find(args: Prisma.${modelName}FindManyArgs){
            return this.prisma.${modelNameLower}.findMany(args);
          }
  
          findOne(where: Prisma.${modelName}WhereUniqueInput){
            return this.prisma.${modelNameLower}.findUnique({ where });
          }
          
          update(where: Prisma.${modelName}WhereUniqueInput, data: Prisma.${modelName}UpdateInput){
            return this.prisma.${modelNameLower}.update({
              where,
              data,
            });
          }
        
          delete(where: Prisma.${modelName}WhereUniqueInput){
            return this.prisma.${modelNameLower}.delete({ where });
          }
      }
      `;
};
