import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AuthUC } from './useCases/auth.UC';
import { AccessSessionsService } from './services/accessSessions.service';
import { UserService } from '../user/services/user.service';
import { JwtStrategy } from '../shared/strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: { expiresIn: configService.get('jwt.expiresIn') },
      }),
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    AuthUC,
    JwtService,
    AccessSessionsService,
    UserService,
    JwtStrategy,
    ConfigService,
  ],
  exports: [AuthService, JwtStrategy],
})
export class AuthModule {}
