import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { HttpStatus } from '@nestjs/common';
import { BaseResponseDto } from '../../shared/dtos/response.dto';
import { Video } from '../../shared/entities/video.entity';
import { ParamsPaginationDto, ResponsePaginationDto } from '../../shared/dtos/pagination.dto';

export class CreateVideoDto {
  @ApiProperty({ example: 'Tutorial de pintura' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'https://www.youtube.com/watch?v=...' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  url: string;
}

export class UpdateVideoDto extends PartialType(CreateVideoDto) {}

export class VideoQueryDto extends ParamsPaginationDto {}

export class GetVideoResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty()
  data: Video;
}

export class GetVideosResponseDto implements BaseResponseDto {
  @ApiProperty({ type: Number, example: HttpStatus.OK })
  statusCode: number;

  @ApiProperty()
  data: ResponsePaginationDto<Video>;
}
