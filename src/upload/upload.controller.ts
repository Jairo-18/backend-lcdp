import {
  Controller,
  HttpStatus,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { UploadService } from './upload.service';

const multerOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten archivos de imagen'), false);
    }
    cb(null, true);
  },
};

const multiFileApiBody = {
  schema: {
    type: 'object',
    properties: {
      files: { type: 'array', items: { type: 'string', format: 'binary' } },
    },
  },
};

@ApiTags('Uploads')
@Controller('uploads')
@UseGuards(AuthGuard())
@ApiBearerAuth()
export class UploadController {
  constructor(private readonly _service: UploadService) {}

  @Post('organizational')
  @ApiOperation({ summary: 'Subir imágenes organizacionales — retorna 3 variantes (thumb/md/lg) por archivo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(multiFileApiBody)
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  async uploadOrganizational(@UploadedFiles() files: Express.Multer.File[]) {
    const images = await this._service.processAndSave(files, 'organizational');
    return { statusCode: HttpStatus.OK, data: { images } };
  }

  @Post('brands')
  @ApiOperation({ summary: 'Subir imágenes de marca — retorna 3 variantes (thumb/md/lg) por archivo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(multiFileApiBody)
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  async uploadBrands(@UploadedFiles() files: Express.Multer.File[]) {
    const images = await this._service.processAndSave(files, 'brands');
    return { statusCode: HttpStatus.OK, data: { images } };
  }

  @Post('categories')
  @ApiOperation({ summary: 'Subir imágenes de categoría — retorna 3 variantes (thumb/md/lg) por archivo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(multiFileApiBody)
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  async uploadCategories(@UploadedFiles() files: Express.Multer.File[]) {
    const images = await this._service.processAndSave(files, 'categories');
    return { statusCode: HttpStatus.OK, data: { images } };
  }

  @Post('products/images')
  @ApiOperation({ summary: 'Subir imágenes de producto — retorna 3 variantes (thumb/md/lg) por archivo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody(multiFileApiBody)
  @UseInterceptors(FilesInterceptor('files', 10, multerOptions))
  async uploadProductImages(@UploadedFiles() files: Express.Multer.File[]) {
    const images = await this._service.processAndSave(files, 'products/images');
    return { statusCode: HttpStatus.OK, data: { images } };
  }
}
