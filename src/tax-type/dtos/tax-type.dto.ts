import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { HttpStatus } from '@nestjs/common';
import { BaseResponseDto } from '../../shared/dtos/response.dto';
import { TaxType } from '../../shared/entities/tax-type.entity';
import { PaginationDto, PaginatedResult } from '../../shared/dtos/pagination.dto';

export class CreateTaxTypeDto {
  @ApiProperty({ example: 'IVA 19%' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'IVA_19' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class UpdateTaxTypeDto extends PartialType(CreateTaxTypeDto) {}

export class TaxTypeQueryDto extends PaginationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;
}

export class GetTaxTypeResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty()
  data: TaxType;
}

export class GetTaxTypesResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty()
  data: PaginatedResult<TaxType>;
}
