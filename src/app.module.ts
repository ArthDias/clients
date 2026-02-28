import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module';
import { AppConfigModule } from './app-config/app-config.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigService } from './app-config/app-config.service';

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
  ],
})
export class AppModule {}
