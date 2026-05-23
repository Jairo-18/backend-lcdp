import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { VideoUC } from '../useCases/video.UC';
import {
  CreateVideoDto,
  GetVideoResponseDto,
  GetVideosResponseDto,
  UpdateVideoDto,
  VideoQueryDto,
} from '../dtos/video.dto';
import {
  CreatedRecordResponseDto,
  DeleteRecordResponseDto,
  UpdateRecordResponseDto,
} from '../../shared/dtos/response.dto';
import { SkipApiKey } from '../../shared/decorators/skip-api-key.decorator';

@ApiTags('Videos')
@Controller('videos')
export class VideoController {
  constructor(private readonly _uc: VideoUC) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear video' })
  async create(@Body() dto: CreateVideoDto): Promise<CreatedRecordResponseDto> {
    const video = await this._uc.create(dto);
    return { statusCode: HttpStatus.CREATED, message: 'Video creado', data: { rowId: video.id } };
  }

  @Get()
  @SkipApiKey()
  @ApiOperation({ summary: 'Listar videos paginados' })
  async findAll(@Query() query: VideoQueryDto): Promise<GetVideosResponseDto> {
    return { statusCode: HttpStatus.OK, data: await this._uc.findAll(query) };
  }

  @Get(':id')
  @SkipApiKey()
  @ApiOperation({ summary: 'Obtener video por ID' })
  async findOne(@Param('id') id: string): Promise<GetVideoResponseDto> {
    return { statusCode: HttpStatus.OK, data: await this._uc.findOne(id) };
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar video' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateVideoDto,
  ): Promise<UpdateRecordResponseDto> {
    await this._uc.update(id, dto);
    return { statusCode: HttpStatus.OK, message: 'Video actualizado' };
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar video' })
  async remove(@Param('id') id: string): Promise<DeleteRecordResponseDto> {
    await this._uc.remove(id);
    return { statusCode: HttpStatus.OK, message: 'Video eliminado' };
  }
}
