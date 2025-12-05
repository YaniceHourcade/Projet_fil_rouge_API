import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,          // supprime les champs non attendus
      forbidNonWhitelisted: true, // renvoie une erreur si un champ inconnu est présent
      transform: true,          // transforme le body JSON en instance de DTO
    }),
  );

  app.use('/public', express.static(join(__dirname, '..', 'public')));

  const config = new DocumentBuilder()
    .setTitle('Mon API projet fil rouge')
    .setDescription(`API Projet fil rouge | API de musique`)
    .addTag(
      'Schema BDD',
      '![schema](http://localhost:3000/public/schema-bdd.png)'
    )
    
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log(`🚀 Application is running on: http://localhost:3000/api`);

}
bootstrap();
