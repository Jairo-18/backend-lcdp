import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { config } from './config';
import { SharedModule } from './shared/shared.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ApiKeyGuard } from './shared/guards/api-key.guard';
import { AuthModule } from './auth/auth.module';
import { OrganizationalModule } from './organizational/organizational.module';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { UnitOfMeasureModule } from './unit-of-measure/unit-of-measure.module';
import { ProductModule } from './product/product.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,
        limit: 100,
      },
    ]),
    ServeStaticModule.forRoot({
      rootPath:
        process.platform === 'win32'
          ? join(process.cwd(), 'uploads')
          : '/app/uploads',
      serveRoot: '/uploads',
      serveStaticOptions: {
        setHeaders: (res) => {
          res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
          res.setHeader('Access-Control-Allow-Origin', '*');
        },
      },
    }),
    SharedModule.forRoot(),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    AuthModule,
    OrganizationalModule,
    BrandModule,
    CategoryModule,
    UnitOfMeasureModule,
    ProductModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
