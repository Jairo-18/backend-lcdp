import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ImageVariantDto, VideoVariantDto } from '../../shared/dtos/image-variant.dto';
import { Organizational } from '../../shared/entities/organizational.entity';
import { Category } from '../../shared/entities/category.entity';
import { UnitOfMeasure } from '../../shared/entities/unit-of-measure.entity';
import { Brand } from '../../shared/entities/brand.entity';
import { TaxType } from '../../shared/entities/tax-type.entity';
import { HttpStatus } from '@nestjs/common';
import { BaseResponseDto } from '../../shared/dtos/response.dto';

export class CreateOrganizationalDto {
  @ApiProperty({ example: 'La Casa del Pintor' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString() legalName?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() nit?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() email?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() phone?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() whatsappNumber?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() website?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() address?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() city?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() department?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString() logoUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() faviconUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() primaryColor?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() secondaryColor?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() accentColor?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() bgColor?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() textColor?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString() facebookUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() instagramUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() youtubeUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() tiktokUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() mapsUrl?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString() description?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() aboutTitle?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() aboutDescription?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() missionTitle?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() missionDescription?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() visionTitle?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() visionDescription?: string;

  @ApiProperty({ required: false }) @IsOptional() @IsString() metaTitle?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() metaDescription?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() metaKeywords?: string;
  @ApiProperty({ required: false, description: 'URL de YouTube para la página Cómo pedir' }) @IsOptional() @IsString() howToOrderVideoUrl?: string;

  @ApiProperty({ required: false, type: [ImageVariantDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageVariantDto)
  bannerImages?: ImageVariantDto[];

  @ApiProperty({ required: false, type: [VideoVariantDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VideoVariantDto)
  heroVideos?: VideoVariantDto[];

  @ApiProperty({ required: false, type: [VideoVariantDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VideoVariantDto)
  aboutVideos?: VideoVariantDto[];

  @ApiProperty({ required: false, type: [ImageVariantDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageVariantDto)
  heroImages?: ImageVariantDto[];

  @ApiProperty({ required: false, type: [ImageVariantDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageVariantDto)
  aboutImages?: ImageVariantDto[];

  @ApiProperty({ required: false }) @IsOptional() @IsString() heroLine1?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() heroLine2?: string;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  heroColors?: string[];
}

export class UpdateOrganizationalDto extends PartialType(CreateOrganizationalDto) {
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() status?: boolean;
}

export class GetOrganizationalResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty()
  data: Organizational;
}

export class BootstrapResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty()
  data: {
    org: Organizational | null;
    categories: Category[];
    units: UnitOfMeasure[];
    brands: Brand[];
    taxTypes: TaxType[];
  };
}
