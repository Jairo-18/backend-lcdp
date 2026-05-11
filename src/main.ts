import * as nodeCrypto from 'node:crypto';

if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = nodeCrypto;
} else {
  if (!(globalThis.crypto as any).randomUUID) {
    (globalThis.crypto as any).randomUUID = nodeCrypto.randomUUID;
  }
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
import basicAuth = require('express-basic-auth');
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import * as bodyParser from 'body-parser';
import { LoggingInterceptor } from './shared/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: false });
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  app.use(bodyParser.urlencoded({ extended: true }));

  const configService = app.get(ConfigService);
  const swaggerUser = configService.get<string>('swagger.user');
  const swaggerPassword = configService.get<string>('swagger.password');

  app.use(
    '/docs',
    basicAuth({
      challenge: true,
      users: { [swaggerUser]: swaggerPassword },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('LA CASA DEL PINTOR API')
    .setDescription('API para la gestión de La Casa del Pintor')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)),
  );

  const allowedOrigins = configService.get<string[]>('app.cors.origin');
  const allowedHeaders = configService.get('app.cors.allowedHeaders');
  const allowedMethods = configService.get('app.cors.allowedMethods');

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes('*')) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    allowedHeaders,
    methods: allowedMethods,
    credentials: true,
  });

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", 'data:'],
          connectSrc: ["'self'"],
          frameSrc: ["'none'"],
          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          frameAncestors: ["'none'"],
          formAction: ["'self'"],
        },
      },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      crossOriginEmbedderPolicy: false,
      frameguard: { action: 'deny' },
      hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
      hidePoweredBy: true,
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      permittedCrossDomainPolicies: { permittedPolicies: 'none' },
      xContentTypeOptions: true,
    }),
  );

  app.use((req: any, res: any, next: any) => {
    const path: string = req.path || '';
    if (path.startsWith('/auth') || path.startsWith('/api')) {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    } else if (
      /\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/.test(path)
    ) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    next();
  });

  const port = configService.get<number>('app.port') || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(
    `App corriendo en el puerto ${port} [${configService.get('app.env')}]`,
  );
}

bootstrap();
