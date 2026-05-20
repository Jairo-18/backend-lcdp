import { Controller, Get, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipApiKey } from '../../shared/decorators/skip-api-key.decorator';
import { ProductUC } from '../useCases/product.UC';
import { ProductQueryDto, GetProductResponseDto, GetProductsResponseDto } from '../dtos/product.dto';

@ApiTags('Public – Products')
@SkipApiKey()
@Controller('public/products')
export class PublicProductController {
  constructor(private readonly _uc: ProductUC) {}

  @Get()
  @ApiOperation({ summary: 'Listar productos activos paginados (25/página, sin auth)' })
  async findAll(@Query() query: ProductQueryDto): Promise<GetProductsResponseDto> {
    return { statusCode: HttpStatus.OK, data: await this._uc.findAllPublic(query) };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto activo por ID (sin auth)' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GetProductResponseDto> {
    return { statusCode: HttpStatus.OK, data: await this._uc.findOne(id) };
  }
}
