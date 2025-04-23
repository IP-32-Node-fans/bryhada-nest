import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Cryptocurrency API')
    .setDescription('The cryptocurrency API description')
    .setVersion('1.0')
    .addTag('cryptocurrency')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  const logger = new Logger('Bootstrap');
  await app.listen(process.env.PORT ?? 5000);
  const appUrl = await app.getUrl();

  logger.log('Application started at ' + appUrl);
  if (process.env.DISABLE_SWAGGER !== 'true') {
    logger.log('Documentation available at ' + appUrl + '/api');
  }
}

bootstrap();
