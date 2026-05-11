import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export interface BaseResponseDto {
  title?: string;
  message?: string;
  statusCode?: number;
  error?: string;
}

export interface ObjectCreatedResponseDto {
  rowId: string;
}

export class CreatedRecordResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.CREATED })
  statusCode: number;

  @ApiProperty({ type: String, example: 'Registro creado' })
  message: string;

  @ApiProperty({ type: Object, example: { rowId: 'uuid' } })
  data: ObjectCreatedResponseDto;
}

export class UpdateRecordResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty({ type: String, example: 'Registro actualizado' })
  message?: string;
}

export class DeleteRecordResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty({ type: String, example: 'Registro eliminado' })
  message?: string;
}

export class UnauthorizedResponseDto implements BaseResponseDto {
  @ApiProperty({ type: String, example: 'No autorizado' })
  message: string;

  @ApiProperty({ type: Number, example: HttpStatus.UNAUTHORIZED })
  statusCode: number;
}

export class NotFoundResponseDto implements BaseResponseDto {
  @ApiProperty({ type: String, example: 'Recurso no encontrado' })
  message: string;

  @ApiProperty({ type: Number, example: HttpStatus.NOT_FOUND })
  statusCode: number;
}
