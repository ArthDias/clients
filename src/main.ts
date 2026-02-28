import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppConfigService } from './app-config/app-config.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new MongoExceptionFilter());

  const config = app.get(AppConfigService);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Clients API')
    .setDescription('API para gerenciamento de clientes')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('swagger', app, document);

  await app.listen(config.port);
}
bootstrap().catch((err) => {
  console.error('Erro ao iniciar aplicação:', err);
  process.exit(1);
});
