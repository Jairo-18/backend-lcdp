import {
  Body, Controller, Delete, Get, HttpStatus,
  Param, ParseIntPipe, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { TaxTypeUC } from '../useCases/tax-type.UC';
import {
  CreateTaxTypeDto,
  GetTaxTypeResponseDto,
  GetTaxTypesResponseDto,
  TaxTypeQueryDto,
  UpdateTaxTypeDto,
} from '../dtos/tax-type.dto';
import {
  CreatedRecordResponseDto,
  DeleteRecordResponseDto,
  UpdateRecordResponseDto,
} from '../../shared/dtos/response.dto';

@ApiTags('Tax Types')
@Controller('tax-types')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class TaxTypeController {
  constructor(private readonly _uc: TaxTypeUC) {}

  @Post()
  @ApiOperation({ summary: 'Crear tipo de impuesto' })
  async create(@Body() dto: CreateTaxTypeDto): Promise<CreatedRecordResponseDto> {
    const taxType = await this._uc.create(dto);
    return { statusCode: HttpStatus.CREATED, message: 'Tipo de impuesto creado', data: { rowId: taxType.id } };
  }

  @Get()
  @ApiOperation({ summary: 'Listar tipos de impuesto paginados (search opcional)' })
  async findAll(@Query() query: TaxTypeQueryDto): Promise<GetTaxTypesResponseDto> {
    return { statusCode: HttpStatus.OK, data: await this._uc.findAll(query) };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener tipo de impuesto por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GetTaxTypeResponseDto> {
    return { statusCode: HttpStatus.OK, data: await this._uc.findOne(id) };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar tipo de impuesto' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTaxTypeDto,
  ): Promise<UpdateRecordResponseDto> {
    await this._uc.update(id, dto);
    return { statusCode: HttpStatus.OK, message: 'Tipo de impuesto actualizado' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar tipo de impuesto' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteRecordResponseDto> {
    await this._uc.remove(id);
    return { statusCode: HttpStatus.OK, message: 'Tipo de impuesto eliminado' };
  }
}
