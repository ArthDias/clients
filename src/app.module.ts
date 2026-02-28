import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { LoggerModule } from 'nestjs-pino';
import { AppConfigModule } from './app-config/app-config.module';
import { AppConfigService } from './app-config/app-config.service';
import { ClientsModule } from './clients/clients.module';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        uri: configService.mongoUri,
      }),
    }),
    ClientsModule,

    LoggerModule.forRoot({
      pinoHttp: {
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
              }
            : undefined,
        level: 'info',
      },
    }),
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: MongoExceptionFilter,
    },
  ],
})
export class AppModule {}
