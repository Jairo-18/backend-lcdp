import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ColorUC } from '../useCases/color.UC';
import {
  CreateColorDto,
  UpdateColorDto,
  ColorQueryDto,
  GetColorResponseDto,
  GetColorsResponseDto,
} from '../dtos/color.dto';
import {
  CreatedRecordResponseDto,
  UpdateRecordResponseDto,
  DeleteRecordResponseDto,
} from '../../shared/dtos/response.dto';
import { SkipApiKey } from '../../shared/decorators/skip-api-key.decorator';

@ApiTags('Colors')
@Controller('colors')
export class ColorController {
  constructor(private readonly _uc: ColorUC) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear color' })
  async create(@Body() dto: CreateColorDto): Promise<CreatedRecordResponseDto> {
    const color = await this._uc.create(dto);
    return { statusCode: HttpStatus.CREATED, message: 'Color creado', data: { rowId: color.id } };
  }

  @Get()
  @SkipApiKey()
  @ApiOperation({ summary: 'Listar colores paginados' })
  async findAll(@Query() query: ColorQueryDto): Promise<GetColorsResponseDto> {
    return { statusCode: HttpStatus.OK, data: await this._uc.findAll(query) };
  }

  @Get(':id')
  @SkipApiKey()
  @ApiOperation({ summary: 'Obtener color por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GetColorResponseDto> {
    return { statusCode: HttpStatus.OK, data: await this._uc.findOne(id) };
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar color' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateColorDto,
  ): Promise<UpdateRecordResponseDto> {
    await this._uc.update(id, dto);
    return { statusCode: HttpStatus.OK, message: 'Color actualizado' };
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar color' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteRecordResponseDto> {
    await this._uc.remove(id);
    return { statusCode: HttpStatus.OK, message: 'Color eliminado' };
  }
}
