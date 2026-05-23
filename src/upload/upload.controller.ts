import {
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { diskStorage, memoryStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';
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

const pdfMulterOptions = {
  storage: memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Solo se permiten archivos PDF'), false);
    }
    cb(null, true);
  },
};

const videoMulterOptions = {
  storage: diskStorage({
    destination: (_req: any, _file: any, cb: any) => {
      const tmpDir =
        process.platform === 'win32'
          ? path.join(process.cwd(), 'uploads', 'tmp')
          : '/app/uploads/tmp';
      fs.mkdirSync(tmpDir, { recursive: true });
      cb(null, tmpDir);
    },
    filename: (_req: any, file: Express.Multer.File, cb: any) => {
      const ext = path.extname(file.originalname) || '.mp4';
      cb(null, `${randomUUID()}-raw${ext}`);
    },
  }),
  limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
  fileFilter: (_req: any, file: Express.Multer.File, cb: any) => {
    const allowed = ['video/mp4', 'video/webm', 'video/quicktime'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Solo se permiten archivos de video (MP4, WebM, MOV)'), false);
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

  @Post('organizational/videos')
  @ApiOperation({ summary: 'Subir video para hero/about — comprime H.264 y genera poster WebP. Retorna { url, poster }' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file', videoMulterOptions))
  async uploadOrganizationalVideo(@UploadedFile() file: Express.Multer.File) {
    const video = await this._service.processAndSaveVideo(file);
    return { statusCode: HttpStatus.OK, data: { video } };
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

  @Post('products/documents')
  @ApiOperation({ summary: 'Subir documento PDF de producto — retorna URL del archivo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(FileInterceptor('file', pdfMulterOptions))
  async uploadProductDocument(@UploadedFile() file: Express.Multer.File) {
    const url = await this._service.saveDocument(file, 'products/documents');
    return { statusCode: HttpStatus.OK, data: { url } };
  }
}
