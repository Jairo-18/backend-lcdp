import {
  Body, Controller, Delete, Get, HttpStatus,
  Param, ParseIntPipe, Patch, Post, Query, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CertificationUC } from '../useCases/certification.UC';
import {
  CreateCertificationDto, UpdateCertificationDto, CertificationQueryDto,
  GetCertificationResponseDto, GetCertificationsResponseDto,
} from '../dtos/certification.dto';
import {
  CreatedRecordResponseDto, DeleteRecordResponseDto, UpdateRecordResponseDto,
} from '../../shared/dtos/response.dto';

@ApiTags('Certifications')
@Controller('certifications')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class CertificationController {
  constructor(private readonly _uc: CertificationUC) {}

  @Post()
  @ApiOperation({ summary: 'Crear certificación' })
  async create(@Body() dto: CreateCertificationDto): Promise<CreatedRecordResponseDto> {
    const cert = await this._uc.create(dto);
    return { statusCode: HttpStatus.CREATED, message: 'Certificación creada', data: { rowId: cert.id } };
  }

  @Get()
  @ApiOperation({ summary: 'Listar certificaciones (admin)' })
  async findAll(@Query() query: CertificationQueryDto): Promise<GetCertificationsResponseDto> {
    return { statusCode: HttpStatus.OK, data: await this._uc.findAll(query) };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener certificación por ID' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GetCertificationResponseDto> {
    return { statusCode: HttpStatus.OK, data: await this._uc.findOne(id) };
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar certificación' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCertificationDto,
  ): Promise<UpdateRecordResponseDto> {
    await this._uc.update(id, dto);
    return { statusCode: HttpStatus.OK, message: 'Certificación actualizada' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar certificación' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<DeleteRecordResponseDto> {
    await this._uc.remove(id);
    return { statusCode: HttpStatus.OK, message: 'Certificación eliminada' };
  }
}
