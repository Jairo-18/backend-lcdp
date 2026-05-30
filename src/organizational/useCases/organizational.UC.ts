import { Injectable } from '@nestjs/common';
import { OrganizationalService } from '../services/organizational.service';
import { CreateOrganizationalDto, UpdateOrganizationalDto } from '../dtos/organizational.dto';
import { Category } from '../../shared/entities/category.entity';
import { UnitOfMeasure } from '../../shared/entities/unit-of-measure.entity';
import { Brand } from '../../shared/entities/brand.entity';
import { TaxType } from '../../shared/entities/tax-type.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrganizationalUC {
  constructor(
    private readonly _orgService: OrganizationalService,
    @InjectRepository(Category)
    private readonly _categoryRepo: Repository<Category>,
    @InjectRepository(UnitOfMeasure)
    private readonly _unitRepo: Repository<UnitOfMeasure>,
    @InjectRepository(Brand)
    private readonly _brandRepo: Repository<Brand>,
    @InjectRepository(TaxType)
    private readonly _taxTypeRepo: Repository<TaxType>,
  ) {}

  async create(dto: CreateOrganizationalDto) {
    return this._orgService.create(dto);
  }

  async findOne() {
    return this._orgService.findOne();
  }

  async update(id: string, dto: UpdateOrganizationalDto) {
    return this._orgService.update(id, dto);
  }

  async bootstrap() {
    const [org, categories, units, brands, taxTypes] = await Promise.all([
      this._orgService.findOne().catch(() => null),
      this._categoryRepo.find({ where: { isActive: true }, select: ['id', 'name', 'code', 'images'], order: { name: 'ASC' } }),
      this._unitRepo.find({ where: { isActive: true }, select: ['id', 'name', 'code'], order: { name: 'ASC' } }),
      this._brandRepo.find({ where: { isActive: true }, select: ['id', 'name', 'code', 'images'], order: { name: 'ASC' } }),
      this._taxTypeRepo.find({ where: { isActive: true }, select: ['id', 'name', 'code'], order: { name: 'ASC' } }),
    ]);

    return { org, categories, units, brands, taxTypes };
  }
}
