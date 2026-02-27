import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest'), ClientsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
