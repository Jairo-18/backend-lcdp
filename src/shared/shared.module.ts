import { ScheduleModule } from '@nestjs/schedule';
import { DynamicModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailerModule } from '@nestjs-modules/mailer';
import { RolesGuard } from './guards/roles.guard';
import { User } from './entities/user.entity';
import { AccessSessions } from './entities/accessSessions.entity';
import { Category } from './entities/category.entity';
import { Video } from './entities/video.entity';
import { UnitOfMeasure } from './entities/unit-of-measure.entity';
import { Brand } from './entities/brand.entity';
import { Product } from './entities/product.entity';
import { ProductPresentation } from './entities/product-presentation.entity';
import { ProductImage } from './entities/product-image.entity';
import { Organizational } from './entities/organizational.entity';
import { TaxType } from './entities/tax-type.entity';
import { TaxTypeRepository } from './repositories/tax-type.repository';
import { UserRepository } from './repositories/user.repository';
import { AccessSessionsRepository } from './repositories/accessSessions.repository';
import { OrganizationalRepository } from './repositories/organizational.repository';
import { BrandRepository } from './repositories/brand.repository';
import { CategoryRepository } from './repositories/category.repository';
import { UnitOfMeasureRepository } from './repositories/unit-of-measure.repository';
import { ProductRepository } from './repositories/product.repository';
import { ProductPresentationRepository } from './repositories/product-presentation.repository';

@Module({})
export class SharedModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: SharedModule,
      imports: [
        ScheduleModule.forRoot(),
        EventEmitterModule.forRoot(),
        TypeOrmModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => {
            const dbHost = configService.get('DB_HOST');
            const isLocal =
              dbHost === 'localhost' || dbHost === '127.0.0.1';
            const sslEnabled =
              configService.get('DB_SSL') === 'true' && !isLocal;

            const config: any = {
              type: 'postgres',
              host: configService.get('DB_HOST'),
              port: configService.get<number>('DB_PORT'),
              username: configService.get('DB_USERNAME'),
              password: configService.get('DB_PASSWORD'),
              database: configService.get('DB_DATABASE'),
              autoLoadEntities: true,
              synchronize: false,
              logging: false,
              extra: {
                keepAlive: true,
                max: 20,
                idleTimeoutMillis: 60000,
                connectionTimeoutMillis: 60000,
              },
            };

            if (sslEnabled) {
              config.ssl = true;
              config.extra = {
                ...config.extra,
                ssl: { rejectUnauthorized: false },
              };
            }

            return config;
          },
        }),

        TypeOrmModule.forFeature([
          User,
          AccessSessions,
          Category,
          Video,
          UnitOfMeasure,
          Brand,
          Product,
          ProductPresentation,
          ProductImage,
          Organizational,
          TaxType,
        ]),

        PassportModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),

        JwtModule.registerAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET_KEY'),
            signOptions: {
              expiresIn: configService.get('JWT_EXPIRES_IN') || '24h',
            },
          }),
        }),

        MailerModule.forRootAsync({
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
            transport: {
              host: configService.get<string>('MAIL_HOST'),
              port: parseInt(configService.get('MAIL_PORT'), 10) || 587,
              secure: configService.get('MAIL_SECURE') === 'true',
              auth: {
                user: configService.get<string>('MAIL_USER'),
                pass: configService.get<string>('MAIL_PASSWORD'),
              },
            },
            defaults: {
              from: configService.get<string>('MAIL_SENDER'),
            },
          }),
        }),
      ],
      providers: [
        RolesGuard,
        UserRepository,
        AccessSessionsRepository,
        OrganizationalRepository,
        BrandRepository,
        CategoryRepository,
        UnitOfMeasureRepository,
        ProductRepository,
        ProductPresentationRepository,
        TaxTypeRepository,
      ],
      exports: [
        JwtModule,
        TypeOrmModule,
        RolesGuard,
        UserRepository,
        AccessSessionsRepository,
        OrganizationalRepository,
        BrandRepository,
        CategoryRepository,
        UnitOfMeasureRepository,
        ProductRepository,
        ProductPresentationRepository,
        TaxTypeRepository,
      ],
    };
  }
}
