import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { HttpStatus } from '@nestjs/common';
import { BaseResponseDto } from '../../shared/dtos/response.dto';
import { Brand } from '../../shared/entities/brand.entity';
import { ImageVariantDto } from '../../shared/dtos/image-variant.dto';
import { PaginationDto, PaginatedResult } from '../../shared/dtos/pagination.dto';

export class CreateBrandDto {
  @ApiProperty({ example: 'Pintuco' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'pintuco' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ required: false, type: [ImageVariantDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageVariantDto)
  images?: ImageVariantDto[];
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}

export class BrandQueryDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;
}

export class GetBrandResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty()
  data: Brand;
}

export class GetBrandsResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty()
  data: PaginatedResult<Brand>;
}
