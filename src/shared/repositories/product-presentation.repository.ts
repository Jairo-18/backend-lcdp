import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProductPresentation } from '../entities/product-presentation.entity';

@Injectable()
export class ProductPresentationRepository extends Repository<ProductPresentation> {
  constructor(dataSource: DataSource) {
    super(ProductPresentation, dataSource.createEntityManager());
  }
}
