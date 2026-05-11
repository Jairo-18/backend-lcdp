import { HttpStatus } from '@nestjs/common';
import { BaseResponseDto } from '../../shared/dtos/response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ type: String, example: 'admin@lcdp.com', required: true })
  @IsString()
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({ type: String, example: 'Admin@123', required: true })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password: string;
}

export class RefreshTokenBodyDto {
  @ApiProperty({
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;
}

export class SignOutBodyDto {
  @ApiProperty({ example: 'uuid-del-usuario', required: true })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9', required: true })
  @IsString()
  @IsNotEmpty()
  accessToken: string;

  @ApiProperty({ example: 'uuid-de-la-sesion', required: true })
  @IsString()
  @IsNotEmpty()
  accessSessionId: string;
}

export class AuthTokenResponseDto {
  @ApiProperty({
    example: {
      accessToken: 'access-token-example',
      refreshToken: 'refresh-token-example',
    },
  })
  tokens: { accessToken: string; refreshToken: string };

  @ApiProperty({
    example: { id: 'uuid', fullName: 'Administrador' },
  })
  user: { id: string; fullName: string };

  @ApiProperty({ type: String, required: false, example: 'uuid-sesion' })
  @IsOptional()
  accessSessionId?: string;
}

export class SignInResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty({ type: String, example: 'Bienvenid@' })
  message: string;

  data: AuthTokenResponseDto;
}

export class RefreshTokenResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  data: {
    tokens: { accessToken: string; refreshToken: string };
    user: { id: string; fullName: string };
  };
}

export class SignOutResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty({ type: String, example: 'Sesión cerrada' })
  message?: string;
}

export class InvalidAccessDataResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.UNAUTHORIZED })
  statusCode: number;
}
