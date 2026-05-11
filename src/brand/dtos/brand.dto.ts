import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { HttpStatus } from '@nestjs/common';
import { BaseResponseDto } from '../../shared/dtos/response.dto';
import { Brand } from '../../shared/entities/brand.entity';

export class CreateBrandDto {
  @ApiProperty({ example: 'Pintuco' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'pintuco' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class UpdateBrandDto extends PartialType(CreateBrandDto) {}

export class GetBrandResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty()
  data: Brand;
}

export class GetBrandsResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty({ type: [Brand] })
  data: Brand[];
}
