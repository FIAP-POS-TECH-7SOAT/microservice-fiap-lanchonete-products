import { Module } from '@nestjs/common';

import { HTTPModule } from '@adapters/drivers/http/http.module';

import { ConfigModule } from '@nestjs/config';

import { schemaEnv } from '@adapters/drivens/infra/envs/env';
import { EnvModule } from '@adapters/drivens/infra/envs/env.module';
import DatabaseModule from '@adapters/drivens/infra/database/prisma/database.module';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    EnvModule,
    HTTPModule,
    ConfigModule.forRoot({
      validate: (env) => schemaEnv.parse(env),
      isGlobal: true,
    }),

    {
      module: DatabaseModule,
      global: true,
    },

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
  ],
  controllers: [],
})
export class AppModule {}
