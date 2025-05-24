import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('Cryptocurrency API')
    .setDescription('The cryptocurrency API description')
    .setVersion('1.0')
    .addTag('cryptocurrency')
    .build();

  const swaggerEnabled = process.env.DISABLE_SWAGGER !== 'true';
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerUiEnabled: swaggerEnabled,
  });

  await app.listen(process.env.PORT ?? 5000);
  const appUrl = await app.getUrl();

  logger.log('Application started at ' + appUrl);

  if (swaggerEnabled) {
    logger.log('Documentation available at ' + appUrl + '/api');
  }
}

bootstrap();
