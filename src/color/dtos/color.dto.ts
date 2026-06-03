import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import { HttpStatus } from '@nestjs/common';
import { BaseResponseDto } from '../../shared/dtos/response.dto';
import {
  ParamsPaginationDto,
  ResponsePaginationDto,
} from '../../shared/dtos/pagination.dto';
import { Color } from '../../shared/entities/color.entity';

export class CreateColorDto {
  @ApiProperty({ example: 'Blanco Hueso' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: '#F5F0E8' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^#([0-9A-Fa-f]{6})$/, { message: 'hex debe ser un color válido (#RRGGBB)' })
  hex: string;

  @ApiProperty({ example: 'Blancos', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  colorFamily?: string;

  @ApiProperty({ example: 'BH-001', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  code?: string;

  @ApiProperty({ example: ['pared', 'techo'], required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsIn(['piso', 'pared', 'techo'], { each: true })
  surfaces?: string[];

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateColorDto extends PartialType(CreateColorDto) {}

export class ColorQueryDto extends ParamsPaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  colorFamily?: string;
}

export class GetColorResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty()
  data: Color;
}

export class GetColorsResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty()
  data: ResponsePaginationDto<Color>;
}
