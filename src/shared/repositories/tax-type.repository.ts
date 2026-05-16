import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { TaxType } from '../entities/tax-type.entity';

@Injectable()
export class TaxTypeRepository extends Repository<TaxType> {
  constructor(dataSource: DataSource) {
    super(TaxType, dataSource.createEntityManager());
  }
}
