import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from '../../shared/entities/category.entity';
import { CategoryRepository } from '../../shared/repositories/category.repository';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly _repo: CategoryRepository) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    const existing = await this._repo.findOne({ where: { code: dto.code } });
    if (existing) throw new ConflictException(`Ya existe una categoría con el código "${dto.code}"`);
    return this._repo.save(this._repo.create(dto));
  }

  async findAll(): Promise<Category[]> {
    return this._repo.find({ order: { name: 'ASC' } });
  }

  async findOne(id: string): Promise<Category> {
    const category = await this._repo.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Categoría no encontrada');
    return category;
  }

  async update(id: string, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);
    if (dto.code && dto.code !== category.code) {
      const existing = await this._repo.findOne({ where: { code: dto.code } });
      if (existing) throw new ConflictException(`Ya existe una categoría con el código "${dto.code}"`);
    }
    Object.assign(category, dto);
    return this._repo.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this._repo.remove(category);
  }
}
