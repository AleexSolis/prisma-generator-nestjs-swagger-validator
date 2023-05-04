export const genClass = (modelName: string): string => {
  const modelNameLower = modelName.toLowerCase();
  return `
      import { Prisma, PrismaClient } from '@prisma/client';
  
      export class ${modelName}Service{
  
          constructor(private prisma:PrismaClient){}
  
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
