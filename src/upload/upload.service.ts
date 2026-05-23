import { BadRequestException, Injectable } from '@nestjs/common';
import sharp from 'sharp';
import * as path from 'path';
import * as fs from 'fs';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { randomUUID } from 'crypto';
import { ImageVariant, VideoVariant } from '../shared/dtos/image-variant.dto';

const execFileAsync = promisify(execFile);

export type UploadFolder = 'organizational' | 'brands' | 'categories' | 'products/images' | 'products/documents';

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

  async processAndSaveVideo(file: Express.Multer.File): Promise<VideoVariant> {
    if (!file) throw new BadRequestException('No se recibió archivo de video');

    const folder = 'organizational/videos';
    const folderPath = path.join(this.basePath, folder);
    fs.mkdirSync(folderPath, { recursive: true });

    const uuid = randomUUID();
    const inputPath = file.path;

    try {
      return await this._processWithFfmpeg(inputPath, folderPath, folder, uuid);
    } catch {
      // FFmpeg no disponible (ej. entorno de desarrollo sin FFmpeg instalado)
      // Guardar el video raw sin comprimir
      return this._saveRawVideo(inputPath, folderPath, folder, uuid, file.originalname);
    } finally {
      fs.unlink(inputPath, () => {});
    }
  }

  private async _processWithFfmpeg(
    inputPath: string,
    folderPath: string,
    folder: string,
    uuid: string,
  ): Promise<VideoVariant> {
    const outputVideoPath = path.join(folderPath, `${uuid}.mp4`);
    const posterTmpPath = path.join(folderPath, `${uuid}-poster-tmp.jpg`);
    const outputPosterPath = path.join(folderPath, `${uuid}-poster.webp`);

    // Re-encode H.264, CRF 28, movflags faststart para streaming web
    await execFileAsync('ffmpeg', [
      '-i', inputPath,
      '-vcodec', 'libx264',
      '-acodec', 'aac',
      '-crf', '28',
      '-preset', 'fast',
      '-movflags', '+faststart',
      '-y',
      outputVideoPath,
    ]);

    // Extraer poster: intenta en el segundo 1, si falla (video muy corto) usa el frame 0
    let posterGenerated = false;
    for (const ts of ['00:00:01', '00:00:00']) {
      try {
        await execFileAsync('ffmpeg', [
          '-i', inputPath, '-ss', ts, '-vframes', '1', '-y', posterTmpPath,
        ]);
        await sharp(posterTmpPath).webp({ quality: 80 }).toFile(outputPosterPath);
        posterGenerated = true;
        break;
      } catch { /* continuar con siguiente timestamp */ }
    }

    fs.unlink(posterTmpPath, () => {});

    return {
      url: `/uploads/${folder}/${uuid}.mp4`,
      poster: posterGenerated ? `/uploads/${folder}/${uuid}-poster.webp` : '',
    };
  }

  private _saveRawVideo(
    inputPath: string,
    folderPath: string,
    folder: string,
    uuid: string,
    originalname: string,
  ): VideoVariant {
    const ext = path.extname(originalname) || '.mp4';
    const filename = `${uuid}${ext}`;
    fs.copyFileSync(inputPath, path.join(folderPath, filename));
    return { url: `/uploads/${folder}/${filename}`, poster: '' };
  }

  async saveDocument(file: Express.Multer.File, folder: string): Promise<string> {
    if (!file) throw new BadRequestException('No se recibió archivo');
    const folderPath = path.join(this.basePath, folder);
    fs.mkdirSync(folderPath, { recursive: true });
    const ext = path.extname(file.originalname) || '.pdf';
    const filename = `${randomUUID()}${ext}`;
    fs.writeFileSync(path.join(folderPath, filename), file.buffer);
    return `/uploads/${folder}/${filename}`;
  }

  deleteFile(filePath: string): void {
    if (!filePath) return;
    const relPath = this._toRelativePath(filePath);
    if (!relPath) return;
    const absPath = path.join(this.basePath, '..', relPath);
    fs.unlink(absPath, () => { /* ignore if already gone */ });
  }

  deleteVariants(variants: ImageVariant): void {
    for (const urlPath of Object.values(variants)) {
      if (!urlPath) continue;
      const relPath = this._toRelativePath(urlPath);
      if (!relPath) continue;
      const absPath = path.join(this.basePath, '..', relPath);
      fs.unlink(absPath, () => { /* ignore if already gone */ });
    }
  }

  deleteVideoVariant(variant: VideoVariant): void {
    for (const urlPath of Object.values(variant)) {
      if (!urlPath) continue;
      const relPath = this._toRelativePath(urlPath);
      if (!relPath) continue;
      const absPath = path.join(this.basePath, '..', relPath);
      fs.unlink(absPath, () => { /* ignore if already gone */ });
    }
  }

  private _toRelativePath(urlOrPath: string): string | null {
    try {
      if (urlOrPath.startsWith('http')) {
        return new URL(urlOrPath).pathname;
      }
      return urlOrPath;
    } catch {
      return null;
    }
  }
}
