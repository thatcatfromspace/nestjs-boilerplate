import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

import { PRISMA_LOG_CONFIG } from './prisma.config';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, 'error' | 'query'>
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({ log: PRISMA_LOG_CONFIG });
  }

  async onModuleInit() {
    await this.$connect();

    this.$on('error', (_e) => {
      console.log(_e.message);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
