import { BadRequestException, HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestApplication, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors({
    credentials: true,
    origin: '*'
  })
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    exceptionFactory: (errors) => {
      const errorMessages = {};
      errorMessages['statusCode'] = HttpStatus.BAD_REQUEST,
        errors.forEach(error => {
          errorMessages[error.property] = Object.values(error.constraints).join('. ').trim()
        });
      errorMessages['error'] = 'Bad Request'
      return new BadRequestException(errorMessages);
    }
  }))
  const config = new DocumentBuilder()
    .setTitle('Event RESTful API')
    .setDescription('This is RESTful API server for data transaction into website apps with NestJS')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(configService.get<number>('PORT', 3000));
  Logger.log(`Running on port ${process.env.PORT || 3000}`);
}

bootstrap();
