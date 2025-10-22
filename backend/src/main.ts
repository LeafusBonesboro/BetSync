import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for local dev and production (Render + Vercel)
  app.enableCors({
    origin: [
      'http://localhost:3000', // local frontend
      'https://bet-sync-beige.vercel.app', // production frontend (Vercel)
    ],
    credentials: true,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');
  console.log(`✅ Server running on port ${port}`);
}
bootstrap();
