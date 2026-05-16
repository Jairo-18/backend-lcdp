import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsArray, IsBoolean, IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Min, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { HttpStatus } from '@nestjs/common';
import { BaseResponseDto } from '../../shared/dtos/response.dto';
import { PaginationDto, PaginatedResult } from '../../shared/dtos/pagination.dto';
import { Product } from '../../shared/entities/product.entity';

export class CreatePresentationDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  unitOfMeasureId: number;

  @ApiProperty({ example: 'PCK-VK-1G', required: false })
  @IsOptional()
  @IsString()
  sku?: string;
}

export class CreateProductDto {
  @ApiProperty({ example: 'Vinilo Tipo 1 Koraza Blanco' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  categoryId: number;

  @ApiProperty({ example: 1 })
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  brandId: number;

  @ApiProperty({ required: false, example: 45900 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  priceSale?: number;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  taxTypeId?: number;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ required: false, example: { rendimiento: '40m² / galón', dilución: '10-15%' } })
  @IsOptional()
  technicalSheet?: Record<string, string | number | boolean>;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiProperty({ type: [CreatePresentationDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePresentationDto)
  presentations?: CreatePresentationDto[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ProductQueryDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  categoryId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  brandId?: number;

  @ApiProperty({ required: false, enum: ['name', 'createdAt'], default: 'name' })
  @IsOptional()
  @IsIn(['name', 'createdAt'])
  orderBy?: 'name' | 'createdAt';

  @ApiProperty({ required: false, enum: ['ASC', 'DESC'], default: 'ASC' })
  @IsOptional()
  @IsIn(['ASC', 'DESC'])
  order?: 'ASC' | 'DESC';
}

export class GetProductResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty()
  data: Product;
}

export class GetProductsResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty()
  data: PaginatedResult<Product>;
}
