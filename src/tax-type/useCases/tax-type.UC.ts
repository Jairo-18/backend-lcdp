import { Injectable } from '@nestjs/common';
import { TaxTypeService } from '../services/tax-type.service';
import { CreateTaxTypeDto, TaxTypeQueryDto, UpdateTaxTypeDto } from '../dtos/tax-type.dto';

@Injectable()
export class TaxTypeUC {
  constructor(private readonly _taxTypeService: TaxTypeService) {}

  async create(dto: CreateTaxTypeDto)                       { return this._taxTypeService.create(dto); }
  async findAll(query: TaxTypeQueryDto)                     { return this._taxTypeService.findAll(query); }
  async findOne(id: number)                                 { return this._taxTypeService.findOne(id); }
  async update(id: number, dto: UpdateTaxTypeDto)           { return this._taxTypeService.update(id, dto); }
  async remove(id: number)                                  { return this._taxTypeService.remove(id); }
}
