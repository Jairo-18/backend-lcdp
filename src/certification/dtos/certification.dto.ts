import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { HttpStatus } from '@nestjs/common';
import { BaseResponseDto } from '../../shared/dtos/response.dto';
import { Certification } from '../../shared/entities/certification.entity';
import { ParamsPaginationDto, ResponsePaginationDto } from '../../shared/dtos/pagination.dto';

export class CreateCertificationDto {
  @ApiProperty({ example: 'Certificado ISO 9001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: 'NTC 1651:1997' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  normCode: string;

  @ApiProperty({ required: false, example: 'Bureau Veritas' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  certifyingBody?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  imageUrl?: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  sortOrder?: number;
}

export class UpdateCertificationDto extends PartialType(CreateCertificationDto) {}

export class CertificationQueryDto extends ParamsPaginationDto {}

export class GetCertificationResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty()
  data: Certification;
}

export class GetCertificationsResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty()
  data: ResponsePaginationDto<Certification>;
}
