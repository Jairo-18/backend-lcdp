import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { VideoController } from './controllers/video.controller';
import { VideoService } from './services/video.service';
import { VideoUC } from './useCases/video.UC';
import { VideoRepository } from '../shared/repositories/video.repository';
import { Video } from '../shared/entities/video.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Video]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [VideoController],
  providers: [VideoService, VideoUC, VideoRepository],
  exports: [VideoService],
})
export class VideoModule {}
