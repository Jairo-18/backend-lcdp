import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { OrganizationalUC } from '../useCases/organizational.UC';
import {
  CreateOrganizationalDto,
  UpdateOrganizationalDto,
  GetOrganizationalResponseDto,
  BootstrapResponseDto,
} from '../dtos/organizational.dto';
import { SkipApiKey } from '../../shared/decorators/skip-api-key.decorator';
import {
  CreatedRecordResponseDto,
  UpdateRecordResponseDto,
} from '../../shared/dtos/response.dto';

@ApiTags('Organizational')
@Controller('organizational')
export class OrganizationalController {
  constructor(private readonly _uc: OrganizationalUC) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear registro organizacional (solo si no existe)' })
  async create(@Body() dto: CreateOrganizationalDto): Promise<CreatedRecordResponseDto> {
    const org = await this._uc.create(dto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Registro organizacional creado',
      data: { rowId: org.id },
    };
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener datos organizacionales' })
  async findOne(): Promise<GetOrganizationalResponseDto> {
    const org = await this._uc.findOne();
    return { statusCode: HttpStatus.OK, data: org };
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar datos organizacionales' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrganizationalDto,
  ): Promise<UpdateRecordResponseDto> {
    await this._uc.update(id, dto);
    return { statusCode: HttpStatus.OK, message: 'Registro organizacional actualizado' };
  }

  @Get('bootstrap')
  @SkipApiKey()
  @ApiOperation({ summary: 'Datos iniciales de la app: org, categorías y unidades de medida' })
  async bootstrap(): Promise<BootstrapResponseDto> {
    const data = await this._uc.bootstrap();
    return { statusCode: HttpStatus.OK, data };
  }
}
