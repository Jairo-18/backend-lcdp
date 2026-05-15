import { Injectable } from '@nestjs/common';
import { BrandService } from '../services/brand.service';
import { BrandQueryDto, CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';

@Injectable()
export class BrandUC {
  constructor(private readonly _brandService: BrandService) {}

  async create(dto: CreateBrandDto)                     { return this._brandService.create(dto); }
  async findAll(query: BrandQueryDto)                   { return this._brandService.findAll(query); }
  async findOne(id: string)                             { return this._brandService.findOne(id); }
  async update(id: string, dto: UpdateBrandDto)         { return this._brandService.update(id, dto); }
  async remove(id: string)                              { return this._brandService.remove(id); }
}
