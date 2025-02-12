import { Module } from '@nestjs/common';
import { MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from '../user/user.module';
import { PostModule } from '../post/post.module';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { GLOBAL_CONFIG } from '../../configs/global.config';
import { LoggerModule } from '../logger/logger.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { LoggerMiddleware } from '../../middlewares/logger.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    LoggerModule,
    PrismaModule,
    AuthModule,
    UserModule,
    PostModule,
    ConfigModule.forRoot({ isGlobal: true, load: [() => GLOBAL_CONFIG] }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 15,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 30,
      },
      {
        name: 'very-long',
        ttl: 1800000,
        limit: 200,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: 'APP_GUARD', useClass: ThrottlerGuard }],
  exports: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
