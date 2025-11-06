import * as dotenv from 'dotenv';
dotenv.config(); // 👈 This loads .env before anything else

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'http://localhost:3000',               // local dev
      'https://bet-sync-vuzf.vercel.app',    // vercel prod
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Backend running on http://localhost:${port}`);
  console.log('✅ Loaded API_URL:', process.env.API_URL); // 👈 debug log
}

bootstrap();
