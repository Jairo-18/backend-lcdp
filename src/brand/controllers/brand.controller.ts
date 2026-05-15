import {
  Body, Controller, Delete, Get, HttpStatus,
  Param, ParseUUIDPipe, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { BrandUC } from '../useCases/brand.UC';
import { BrandQueryDto, CreateBrandDto, UpdateBrandDto, GetBrandResponseDto, GetBrandsResponseDto } from '../dtos/brand.dto';
import {
  CreatedRecordResponseDto,
  DeleteRecordResponseDto,
  UpdateRecordResponseDto,
} from '../../shared/dtos/response.dto';

@ApiTags('Brands')
@Controller('brands')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class BrandController {
  constructor(private readonly _uc: BrandUC) {}

  @Post()
  @ApiOperation({ summary: 'Crear marca' })
  async create(@Body() dto: CreateBrandDto): Promise<CreatedRecordResponseDto> {
    const brand = await this._uc.create(dto);
    return { statusCode: HttpStatus.CREATED, message: 'Marca creada', data: { rowId: brand.id } };
  }

  @Get()
  @ApiOperation({ summary: 'Listar marcas paginadas (search opcional)' })
  async findAll(@Query() query: BrandQueryDto): Promise<GetBrandsResponseDto> {
    return { statusCode: HttpStatus.OK, data: await this._uc.findAll(query) };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener marca por ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<GetBrandResponseDto> {
    return { statusCode: HttpStatus.OK, data: await this._uc.findOne(id) };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar marca' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBrandDto,
  ): Promise<UpdateRecordResponseDto> {
    await this._uc.update(id, dto);
    return { statusCode: HttpStatus.OK, message: 'Marca actualizada' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar marca' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteRecordResponseDto> {
    await this._uc.remove(id);
    return { statusCode: HttpStatus.OK, message: 'Marca eliminada' };
  }
}
