import {
  Body, Controller, Delete, Get, HttpStatus,
  Param, ParseIntPipe, Patch, Post, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UnitOfMeasureUC } from '../useCases/unit-of-measure.UC';
import {
  CreateUnitOfMeasureDto, UpdateUnitOfMeasureDto,
  GetUnitOfMeasureResponseDto, GetUnitsOfMeasureResponseDto,
} from '../dtos/unit-of-measure.dto';
import {
  CreatedRecordResponseDto,
  DeleteRecordResponseDto,
  UpdateRecordResponseDto,
} from '../../shared/dtos/response.dto';

@ApiTags('Units of Measure')
@Controller('units-of-measure')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class UnitOfMeasureController {
  constructor(private readonly _uc: UnitOfMeasureUC) {}

  @Post()
  @ApiOperation({ summary: 'Crear unidad de medida' })
  async create(@Body() dto: CreateUnitOfMeasureDto): Promise<CreatedRecordResponseDto> {
    const unit = await this._uc.create(dto);
    return { statusCode: HttpStatus.CREATED, message: 'Unidad de medida creada', data: { rowId: unit.id } };
  }

  @Get()
  @ApiOperation({ summary: 'Listar unidades de medida' })
  async findAll(): Promise<GetUnitsOfMeasureResponseDto> {
    return { statusCode: HttpStatus.OK, data: await this._uc.findAll() };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener unidad de medida por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GetUnitOfMeasureResponseDto> {
    return { statusCode: HttpStatus.OK, data: await this._uc.findOne(id) };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar unidad de medida' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUnitOfMeasureDto,
  ): Promise<UpdateRecordResponseDto> {
    await this._uc.update(id, dto);
    return { statusCode: HttpStatus.OK, message: 'Unidad de medida actualizada' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar unidad de medida' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteRecordResponseDto> {
    await this._uc.remove(id);
    return { statusCode: HttpStatus.OK, message: 'Unidad de medida eliminada' };
  }
}
