import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Brand } from '../../shared/entities/brand.entity';
import { BrandRepository } from '../../shared/repositories/brand.repository';
import { CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';

@Injectable()
export class BrandService {
  constructor(private readonly _repo: BrandRepository) {}

  async create(dto: CreateBrandDto): Promise<Brand> {
    const existing = await this._repo.findOne({ where: { code: dto.code } });
    if (existing) throw new ConflictException(`Ya existe una marca con el código "${dto.code}"`);
    return this._repo.save(this._repo.create(dto));
  }

  async findAll(): Promise<Brand[]> {
    return this._repo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Brand> {
    const brand = await this._repo.findOne({ where: { id } });
    if (!brand) throw new NotFoundException('Marca no encontrada');
    return brand;
  }

  async update(id: string, dto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.findOne(id);
    if (dto.code && dto.code !== brand.code) {
      const existing = await this._repo.findOne({ where: { code: dto.code } });
      if (existing) throw new ConflictException(`Ya existe una marca con el código "${dto.code}"`);
    }
    Object.assign(brand, dto);
    return this._repo.save(brand);
  }

  async remove(id: string): Promise<void> {
    const brand = await this.findOne(id);
    await this._repo.remove(brand);
  }
}
