import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { HttpStatus } from '@nestjs/common';
import { BaseResponseDto } from '../../shared/dtos/response.dto';
import { Category } from '../../shared/entities/category.entity';
import { ImageVariantDto } from '../../shared/dtos/image-variant.dto';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Pinturas' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'pinturas' })
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

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class GetCategoryResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty()
  data: Category;
}

export class GetCategoriesResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty({ type: [Category] })
  data: Category[];
}
