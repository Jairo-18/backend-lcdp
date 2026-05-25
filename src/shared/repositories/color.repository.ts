import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Color } from '../entities/color.entity';

@Injectable()
export class ColorRepository extends Repository<Color> {
  constructor(dataSource: DataSource) {
    super(Color, dataSource.createEntityManager());
  }
}
