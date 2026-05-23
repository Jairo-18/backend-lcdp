import { Injectable, NotFoundException } from '@nestjs/common';
import { Video } from '../../shared/entities/video.entity';
import { VideoRepository } from '../../shared/repositories/video.repository';
import { CreateVideoDto, UpdateVideoDto, VideoQueryDto } from '../dtos/video.dto';
import { PageMetaDto } from '../../shared/dtos/pageMeta.dto';
import { ResponsePaginationDto } from '../../shared/dtos/pagination.dto';

@Injectable()
export class VideoService {
  constructor(private readonly _repo: VideoRepository) {}

  async create(dto: CreateVideoDto): Promise<Video> {
    return this._repo.save(this._repo.create(dto));
  }

  async findAll(query: VideoQueryDto): Promise<ResponsePaginationDto<Video>> {
    const page = query.page ?? 1;
    const perPage = query.perPage ?? 10;
    const skip = (page - 1) * perPage;

    const qb = this._repo
      .createQueryBuilder('video')
      .orderBy('video.createdAt', 'DESC')
      .skip(skip)
      .take(perPage);

    if (query.search) {
      qb.andWhere('LOWER(video.title) LIKE LOWER(:s)', { s: `%${query.search}%` });
    }

    const [items, itemCount] = await qb.getManyAndCount();
    const pageMeta = new PageMetaDto({ itemCount, pageOptionsDto: query });
    return new ResponsePaginationDto(items, pageMeta);
  }

  async findOne(id: string): Promise<Video> {
    const video = await this._repo.findOne({ where: { id } });
    if (!video) throw new NotFoundException('Video no encontrado');
    return video;
  }

  async update(id: string, dto: UpdateVideoDto): Promise<Video> {
    const video = await this.findOne(id);
    Object.assign(video, dto);
    return this._repo.save(video);
  }

  async remove(id: string): Promise<void> {
    const video = await this.findOne(id);
    await this._repo.remove(video);
  }
}
