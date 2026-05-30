import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Certification } from '../entities/certification.entity';

@Injectable()
export class CertificationRepository extends Repository<Certification> {
  constructor(dataSource: DataSource) {
    super(Certification, dataSource.createEntityManager());
  }
}
