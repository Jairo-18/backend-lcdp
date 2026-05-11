import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UnitOfMeasure } from '../entities/unit-of-measure.entity';

@Injectable()
export class UnitOfMeasureRepository extends Repository<UnitOfMeasure> {
  constructor(dataSource: DataSource) {
    super(UnitOfMeasure, dataSource.createEntityManager());
  }
}
