import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Simple clean CORS for Supabase JWT auth
  app.enableCors({
    origin: true,           // allow all (Vercel, localhost, etc.)
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const port = process.env.PORT || 4000;
  await app.listen(port, "0.0.0.0");

  console.log(`🚀 Backend running on http://localhost:${port}`);
}

bootstrap();
