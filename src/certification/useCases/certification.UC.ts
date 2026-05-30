import { Injectable } from '@nestjs/common';
import { CertificationService } from '../services/certification.service';
import { CreateCertificationDto, CertificationQueryDto, UpdateCertificationDto } from '../dtos/certification.dto';

@Injectable()
export class CertificationUC {
  constructor(private readonly _service: CertificationService) {}

  async create(dto: CreateCertificationDto) { return this._service.create(dto); }
  async findAll(query: CertificationQueryDto) { return this._service.findAll(query); }
  async findAllActive() { return this._service.findAllActive(); }
  async findOne(id: number) { return this._service.findOne(id); }
  async update(id: number, dto: UpdateCertificationDto) { return this._service.update(id, dto); }
  async remove(id: number) { return this._service.remove(id); }
}
