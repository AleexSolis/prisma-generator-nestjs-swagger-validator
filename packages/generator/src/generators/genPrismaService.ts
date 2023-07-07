import { fileToWrite } from 'src/types';
import path from 'path';

const genPrismaModule = () => {
  return `
  import { Global, Module } from '@nestjs/common';
  import { PrismaService } from './prisma.service';
  
  @Global()
  @Module({
    providers: [PrismaService],
    exports: [PrismaService],
  })
  export class PrismaModule {}
    `;
};

const genPrismaService = () => {
  return `
    import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
    import { PrismaClient } from '@prisma/client';

    @Injectable()
    export class PrismaService extends PrismaClient implements OnModuleInit {
        async onModuleInit() {
            await this.$connect();
        }

        async enableShutdownHooks(app: INestApplication) {
            this.$on('beforeExit', async () => {
            await app.close();
            });
        }
    }
    `;
};

export const handleGenPrismaModule = (output: string): fileToWrite[] => {
  return [
    {
      content: genPrismaModule(),
      location: path.join(output, 'prisma', `prisma.module.ts`),
    },
    {
      content: genPrismaService(),
      location: path.join(output, 'prisma', `prisma.service.ts`),
    },
  ];
};
