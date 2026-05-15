import { BadRequestException, Injectable } from '@nestjs/common';
import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';
import { ImageVariant } from '../shared/dtos/image-variant.dto';

export type UploadFolder = 'organizational' | 'brands' | 'categories' | 'products/images';

const VARIANTS = [
  { suffix: 'thumb', width: 400,  quality: 65 },
  { suffix: 'md',    width: 900,  quality: 75 },
  { suffix: 'lg',    width: 3840, quality: 80 },
] as const;

@Injectable()
export class UploadService {
  private readonly basePath =
    process.platform === 'win32'
      ? path.join(process.cwd(), 'uploads')
      : '/app/uploads';

  async processAndSave(files: Express.Multer.File[], folder: UploadFolder): Promise<ImageVariant[]> {
    if (!files || files.length === 0) throw new BadRequestException('No se recibieron archivos');

    const folderPath = path.join(this.basePath, folder);
    fs.mkdirSync(folderPath, { recursive: true });

    const results: ImageVariant[] = [];

    for (const file of files) {
      const uuid = randomUUID();
      const variant: Partial<ImageVariant> = {};

      try {
        await Promise.all(
          VARIANTS.map(({ suffix, width, quality }) => {
            const filename = `${uuid}-${suffix}.webp`;
            variant[suffix] = `/uploads/${folder}/${filename}`;
            return sharp(file.buffer)
              .resize(width, undefined, { withoutEnlargement: true, fit: 'inside' })
              .webp({ quality })
              .toFile(path.join(folderPath, filename));
          }),
        );
      } catch {
        throw new BadRequestException(`Archivo inválido o corrupto: ${file.originalname}`);
      }

      results.push(variant as ImageVariant);
    }

    return results;
  }
}
