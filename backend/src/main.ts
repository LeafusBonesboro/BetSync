import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from "cookie-parser";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // 🔥 FIX FOR SAFARI + RENDER + CROSS-DOMAIN COOKIES
  app.enableCors({
    origin: (origin, callback) => {
      callback(null, true); // allow all origins (for Vercel etc.)
    },
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Authorization, X-Requested-With",
  });

  // 🔥 Required for Safari & iOS WebView to allow cookies
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    
    // Handle OPTIONS preflight requests
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    next();
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = process.env.PORT || 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Backend running on http://localhost:${port}`);
}

bootstrap();
