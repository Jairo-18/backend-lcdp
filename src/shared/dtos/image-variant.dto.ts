import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ImageVariantDto {
  @ApiProperty({ example: '/uploads/products/images/uuid-thumb.webp' })
  @IsString()
  thumb: string;

  @ApiProperty({ example: '/uploads/products/images/uuid-md.webp' })
  @IsString()
  md: string;

  @ApiProperty({ example: '/uploads/products/images/uuid-lg.webp' })
  @IsString()
  lg: string;
}

export interface ImageVariant {
  thumb: string;
  md: string;
  lg: string;
}
