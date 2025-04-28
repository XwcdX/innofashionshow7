import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Allow CORS
  app.enableCors({
    origin: 'http://localhost:3000', // frontend kamu
    credentials: true, // kalau perlu cookie
  });
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
