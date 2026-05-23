import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Video } from '../entities/video.entity';

@Injectable()
export class VideoRepository extends Repository<Video> {
  constructor(dataSource: DataSource) {
    super(Video, dataSource.createEntityManager());
  }
}
