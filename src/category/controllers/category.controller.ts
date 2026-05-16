import {
  Body, Controller, Delete, Get, HttpStatus,
  Param, ParseIntPipe, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CategoryUC } from '../useCases/category.UC';
import { CategoryQueryDto, CreateCategoryDto, UpdateCategoryDto, GetCategoryResponseDto, GetCategoriesResponseDto } from '../dtos/category.dto';
import {
  CreatedRecordResponseDto,
  DeleteRecordResponseDto,
  UpdateRecordResponseDto,
} from '../../shared/dtos/response.dto';

@ApiTags('Categories')
@Controller('categories')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class CategoryController {
  constructor(private readonly _uc: CategoryUC) {}

  @Post()
  @ApiOperation({ summary: 'Crear categoría' })
  async create(@Body() dto: CreateCategoryDto): Promise<CreatedRecordResponseDto> {
    const category = await this._uc.create(dto);
    return { statusCode: HttpStatus.CREATED, message: 'Categoría creada', data: { rowId: category.id } };
  }

  @Get()
  @ApiOperation({ summary: 'Listar categorías paginadas (search opcional)' })
  async findAll(@Query() query: CategoryQueryDto): Promise<GetCategoriesResponseDto> {
    return { statusCode: HttpStatus.OK, data: await this._uc.findAll(query) };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener categoría por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GetCategoryResponseDto> {
    return { statusCode: HttpStatus.OK, data: await this._uc.findOne(id) };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar categoría' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ): Promise<UpdateRecordResponseDto> {
    await this._uc.update(id, dto);
    return { statusCode: HttpStatus.OK, message: 'Categoría actualizada' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar categoría' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteRecordResponseDto> {
    await this._uc.remove(id);
    return { statusCode: HttpStatus.OK, message: 'Categoría eliminada' };
  }
}
