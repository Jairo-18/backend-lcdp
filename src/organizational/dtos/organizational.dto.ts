import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Organizational } from '../../shared/entities/organizational.entity';
import { Category } from '../../shared/entities/category.entity';
import { UnitOfMeasure } from '../../shared/entities/unit-of-measure.entity';
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
  };
}
