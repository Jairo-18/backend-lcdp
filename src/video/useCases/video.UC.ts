import { Injectable } from '@nestjs/common';
import { VideoService } from '../services/video.service';
import { CreateVideoDto, UpdateVideoDto, VideoQueryDto } from '../dtos/video.dto';

@Injectable()
export class VideoUC {
  constructor(private readonly _videoService: VideoService) {}

  async create(dto: CreateVideoDto) { return this._videoService.create(dto); }
  async findAll(query: VideoQueryDto) { return this._videoService.findAll(query); }
  async findOne(id: string) { return this._videoService.findOne(id); }
  async update(id: string, dto: UpdateVideoDto) { return this._videoService.update(id, dto); }
  async remove(id: string) { return this._videoService.remove(id); }
}
