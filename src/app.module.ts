import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule } from './clients/clients.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/nest'), ClientsModule],
})
export class AppModule {}
