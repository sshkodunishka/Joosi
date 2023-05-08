import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser());
  app.enableCors();
  console.log(process.env);
  await app.listen(PORT, () => console.log(`Сервер зарущен на порте ${PORT}`));
}
bootstrap();
