import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { TaxType } from '../../shared/entities/tax-type.entity';
import { TaxTypeRepository } from '../../shared/repositories/tax-type.repository';
import { CreateTaxTypeDto, TaxTypeQueryDto, UpdateTaxTypeDto } from '../dtos/tax-type.dto';
import { PageMetaDto } from '../../shared/dtos/pageMeta.dto';
import { ResponsePaginationDto } from '../../shared/dtos/pagination.dto';
import { ProductRepository } from '../../shared/repositories/product.repository';

@Injectable()
export class TaxTypeService {
  constructor(
    private readonly _repo: TaxTypeRepository,
    private readonly _productRepo: ProductRepository,
  ) {}

  async create(dto: CreateTaxTypeDto): Promise<TaxType> {
    const existing = await this._repo.findOne({ where: { code: dto.code } });
    if (existing) throw new ConflictException(`Ya existe un tipo de impuesto con el código "${dto.code}"`);
    return this._repo.save(this._repo.create(dto));
  }

  async findAll(query: TaxTypeQueryDto): Promise<ResponsePaginationDto<TaxType>> {
    const page    = query.page    ?? 1;
    const perPage = query.perPage ?? 10;
    const skip    = (page - 1) * perPage;

    const qb = this._repo
      .createQueryBuilder('taxType')
      .orderBy('taxType.name', query.order ?? 'ASC')
      .skip(skip)
      .take(perPage);

    if (query.search) {
      qb.andWhere('LOWER(taxType.name) LIKE LOWER(:s)', { s: `%${query.search}%` });
    }

    const [items, itemCount] = await qb.getManyAndCount();
    const pageMeta = new PageMetaDto({ itemCount, pageOptionsDto: query });
    return new ResponsePaginationDto(items, pageMeta);
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
    const count = await this._productRepo.count({ where: { taxTypeId: id } });
    if (count > 0)
      throw new ConflictException(`Este tipo de impuesto está asociado a ${count} producto(s) y no puede eliminarse`);
    await this._repo.remove(taxType);
  }
}
