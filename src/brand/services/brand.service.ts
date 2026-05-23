import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Brand } from '../../shared/entities/brand.entity';
import { BrandRepository } from '../../shared/repositories/brand.repository';
import { BrandQueryDto, CreateBrandDto, UpdateBrandDto } from '../dtos/brand.dto';
import { PageMetaDto } from '../../shared/dtos/pageMeta.dto';
import { ResponsePaginationDto } from '../../shared/dtos/pagination.dto';
import { UploadService } from '../../upload/upload.service';
import { ProductRepository } from '../../shared/repositories/product.repository';

@Injectable()
export class BrandService {
  constructor(
    private readonly _repo: BrandRepository,
    private readonly _upload: UploadService,
    private readonly _productRepo: ProductRepository,
  ) {}

  async create(dto: CreateBrandDto): Promise<Brand> {
    const existing = await this._repo.findOne({ where: { code: dto.code } });
    if (existing) throw new ConflictException(`Ya existe una marca con el código "${dto.code}"`);
    return this._repo.save(this._repo.create(dto));
  }

  async findAll(query: BrandQueryDto): Promise<ResponsePaginationDto<Brand>> {
    const page   = query.page    ?? 1;
    const perPage = query.perPage ?? 10;
    const skip   = (page - 1) * perPage;

    const qb = this._repo
      .createQueryBuilder('brand')
      .orderBy('brand.name', query.order ?? 'ASC')
      .skip(skip)
      .take(perPage);

    if (query.search) {
      qb.andWhere('LOWER(brand.name) LIKE LOWER(:s)', { s: `%${query.search}%` });
    }

    const [items, itemCount] = await qb.getManyAndCount();
    const pageMeta = new PageMetaDto({ itemCount, pageOptionsDto: query });
    return new ResponsePaginationDto(items, pageMeta);
  }

  async findOne(id: number): Promise<Brand> {
    const brand = await this._repo.findOne({ where: { id } });
    if (!brand) throw new NotFoundException('Marca no encontrada');
    return brand;
  }

  async update(id: number, dto: UpdateBrandDto): Promise<Brand> {
    const brand = await this.findOne(id);
    if (dto.code && dto.code !== brand.code) {
      const existing = await this._repo.findOne({ where: { code: dto.code } });
      if (existing) throw new ConflictException(`Ya existe una marca con el código "${dto.code}"`);
    }
    if (dto.images !== undefined) {
      const removed = brand.images.filter(
        old => !dto.images!.some(n => n.thumb === old.thumb),
      );
      removed.forEach(v => this._upload.deleteVariants(v));
    }
    Object.assign(brand, dto);
    return this._repo.save(brand);
  }

  async remove(id: number): Promise<void> {
    const brand = await this.findOne(id);
    const count = await this._productRepo.count({ where: { brandId: id } });
    if (count > 0)
      throw new ConflictException(`Esta marca está asociada a ${count} producto(s) y no puede eliminarse`);
    brand.images.forEach(v => this._upload.deleteVariants(v));
    await this._repo.remove(brand);
  }
}
