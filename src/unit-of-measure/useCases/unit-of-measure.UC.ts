import { Injectable } from '@nestjs/common';
import { UnitOfMeasureService } from '../services/unit-of-measure.service';
import { CreateUnitOfMeasureDto, UpdateUnitOfMeasureDto } from '../dtos/unit-of-measure.dto';

@Injectable()
export class UnitOfMeasureUC {
  constructor(private readonly _service: UnitOfMeasureService) {}

  async create(dto: CreateUnitOfMeasureDto) { return this._service.create(dto); }
  async findAll() { return this._service.findAll(); }
  async findOne(id: string) { return this._service.findOne(id); }
  async update(id: string, dto: UpdateUnitOfMeasureDto) { return this._service.update(id, dto); }
  async remove(id: string) { return this._service.remove(id); }
}
