import {
  Body, Controller, Delete, Get, HttpStatus,
  Param, ParseUUIDPipe, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProductUC } from '../useCases/product.UC';
import {
  CreateProductDto, GetProductResponseDto, GetProductsResponseDto,
  ProductQueryDto, UpdateProductDto,
} from '../dtos/product.dto';
import {
  CreatedRecordResponseDto,
  DeleteRecordResponseDto,
  UpdateRecordResponseDto,
} from '../../shared/dtos/response.dto';

@ApiTags('Products')
@Controller('products')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class ProductController {
  constructor(private readonly _uc: ProductUC) {}

  @Post()
  @ApiOperation({ summary: 'Crear producto con sus presentaciones' })
  async create(@Body() dto: CreateProductDto): Promise<CreatedRecordResponseDto> {
    const product = await this._uc.create(dto);
    return { statusCode: HttpStatus.CREATED, message: 'Producto creado', data: { rowId: product.id } };
  }

  @Get()
  @ApiOperation({ summary: 'Listar productos paginados con filtros opcionales (search, categoryId, brandId)' })
  async findAll(@Query() query: ProductQueryDto): Promise<GetProductsResponseDto> {
    return { statusCode: HttpStatus.OK, data: await this._uc.findAll(query) };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID con todas sus relaciones e imágenes' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<GetProductResponseDto> {
    return { statusCode: HttpStatus.OK, data: await this._uc.findOne(id) };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar producto (si envías presentations reemplaza las existentes)' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<UpdateRecordResponseDto> {
    await this._uc.update(id, dto);
    return { statusCode: HttpStatus.OK, message: 'Producto actualizado' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar producto y sus presentaciones' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteRecordResponseDto> {
    await this._uc.remove(id);
    return { statusCode: HttpStatus.OK, message: 'Producto eliminado' };
  }
}
