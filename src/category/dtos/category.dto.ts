import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { HttpStatus } from '@nestjs/common';
import { BaseResponseDto } from '../../shared/dtos/response.dto';
import { Category } from '../../shared/entities/category.entity';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Pinturas' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'pinturas' })
  @IsString()
  @IsNotEmpty()
  code: string;
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
