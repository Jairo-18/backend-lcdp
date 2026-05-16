import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TaxType } from '../../shared/entities/tax-type.entity';
import { TaxTypeRepository } from '../../shared/repositories/tax-type.repository';
import { CreateTaxTypeDto, TaxTypeQueryDto, UpdateTaxTypeDto } from '../dtos/tax-type.dto';
import { PaginatedResult } from '../../shared/dtos/pagination.dto';

@Injectable()
export class TaxTypeService {
  constructor(private readonly _repo: TaxTypeRepository) {}

  async create(dto: CreateTaxTypeDto): Promise<TaxType> {
    const existing = await this._repo.findOne({ where: { code: dto.code } });
    if (existing) throw new ConflictException(`Ya existe un tipo de impuesto con el código "${dto.code}"`);
    return this._repo.save(this._repo.create(dto));
  }

  async findAll(query: TaxTypeQueryDto): Promise<PaginatedResult<TaxType>> {
    const page  = query.page  ?? 1;
    const limit = query.limit ?? 10;
    const skip  = (page - 1) * limit;

    const qb = this._repo
      .createQueryBuilder('taxType')
      .orderBy('taxType.name', 'ASC')
      .skip(skip)
      .take(limit);

    if (query.search) {
      qb.andWhere('LOWER(taxType.name) LIKE LOWER(:s)', { s: `%${query.search}%` });
    }

    const [items, total] = await qb.getManyAndCount();
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(id: number): Promise<TaxType> {
    const taxType = await this._repo.findOne({ where: { id } });
    if (!taxType) throw new NotFoundException('Tipo de impuesto no encontrado');
    return taxType;
  }

  async update(id: number, dto: UpdateTaxTypeDto): Promise<TaxType> {
    const taxType = await this.findOne(id);
    if (dto.code && dto.code !== taxType.code) {
      const existing = await this._repo.findOne({ where: { code: dto.code } });
      if (existing) throw new ConflictException(`Ya existe un tipo de impuesto con el código "${dto.code}"`);
    }
    Object.assign(taxType, dto);
    return this._repo.save(taxType);
  }

  async remove(id: number): Promise<void> {
    const taxType = await this.findOne(id);
    await this._repo.remove(taxType);
  }
}
