import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { HttpStatus } from '@nestjs/common';
import { BaseResponseDto } from '../../shared/dtos/response.dto';
import { UnitOfMeasure } from '../../shared/entities/unit-of-measure.entity';

export class CreateUnitOfMeasureDto {
  @ApiProperty({ example: 'Galón' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'GL' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export class UpdateUnitOfMeasureDto extends PartialType(CreateUnitOfMeasureDto) {}

export class GetUnitOfMeasureResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty()
  data: UnitOfMeasure;
}

export class GetUnitsOfMeasureResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty({ type: [UnitOfMeasure] })
  data: UnitOfMeasure[];
}
