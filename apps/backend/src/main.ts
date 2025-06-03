import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { defaultLogger } from '@buildyourownphd/utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false, // We'll use our custom logger
  });

  // Use custom logger
  app.useLogger({
    log: (message: string, context?: string) => defaultLogger.info(message, { context }),
    error: (message: string, trace?: string, context?: string) => 
      defaultLogger.error(message, new Error(trace || message), { context }),
    warn: (message: string, context?: string) => defaultLogger.warn(message, { context }),
    debug: (message: string, context?: string) => defaultLogger.debug(message, { context }),
    verbose: (message: string, context?: string) => defaultLogger.debug(message, { context }),
  });

  const configService = app.get(ConfigService);
  
  // Enable CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGINS', 'http://localhost:3000').split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remove non-whitelisted properties
      forbidNonWhitelisted: true, // Throw error for non-whitelisted properties
      transform: true, // Transform payload to DTO instance
      transformOptions: {
        enableImplicitConversion: true,
      },
      disableErrorMessages: process.env.NODE_ENV === 'production',
    }),
  );

  // Set global prefix
  app.setGlobalPrefix('api', {
    exclude: ['health', 'health/ready', 'health/live'],
  });

  const port = configService.get('PORT', 3001);
  const nodeEnv = configService.get('NODE_ENV', 'development');
  
  await app.listen(port);
  
  defaultLogger.info(`🚀 Application is running on: http://localhost:${port}`, {
    environment: nodeEnv,
    port,
  });
}

bootstrap().catch((error) => {
  defaultLogger.error('Failed to start application', error);
  process.exit(1);
});
