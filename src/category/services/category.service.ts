import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '../../shared/entities/category.entity';
import { CategoryRepository } from '../../shared/repositories/category.repository';
import { CategoryQueryDto, CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';
import { PageMetaDto } from '../../shared/dtos/pageMeta.dto';
import { ResponsePaginationDto } from '../../shared/dtos/pagination.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly _repo: CategoryRepository) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const existing = await this._repo.findOne({ where: { code: dto.code } });
    if (existing) throw new ConflictException(`Ya existe una categoría con el código "${dto.code}"`);
    return this._repo.save(this._repo.create(dto));
  }

  async findAll(query: CategoryQueryDto): Promise<ResponsePaginationDto<Category>> {
    const page    = query.page    ?? 1;
    const perPage = query.perPage ?? 10;
    const skip    = (page - 1) * perPage;

    const qb = this._repo
      .createQueryBuilder('category')
      .orderBy('category.name', query.order ?? 'ASC')
      .skip(skip)
      .take(perPage);

    if (query.search) {
      qb.andWhere('LOWER(category.name) LIKE LOWER(:s)', { s: `%${query.search}%` });
    }

    const [items, itemCount] = await qb.getManyAndCount();
    const pageMeta = new PageMetaDto({ itemCount, pageOptionsDto: query });
    return new ResponsePaginationDto(items, pageMeta);
  }

  async findOne(id: number): Promise<Category> {
    const category = await this._repo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Categoría no encontrada');
    return category;
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    if (dto.code && dto.code !== category.code) {
      const existing = await this._repo.findOne({ where: { code: dto.code } });
      if (existing) throw new ConflictException(`Ya existe una categoría con el código "${dto.code}"`);
    }
    Object.assign(category, dto);
    return this._repo.save(category);
  }

  async remove(id: number): Promise<void> {
    const category = await this.findOne(id);
    await this._repo.remove(category);
  }
}
