import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from './utils/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for the specific origin
  app.enableCors({
    origin: 'http://localhost:3000', // Replace with your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.setGlobalPrefix('v1');
  
  // Swagger configuration
  const swagger = new DocumentBuilder()
    .setTitle('Foodco Test App')
    .setDescription('Api Documentation for foodco test app')
    .setVersion('1.0')
    .build();
  
  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(config.web.port);
}
bootstrap();
