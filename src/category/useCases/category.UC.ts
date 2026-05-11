import { Injectable } from '@nestjs/common';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from '../dtos/category.dto';

@Injectable()
export class CategoryUC {
  constructor(private readonly _categoryService: CategoryService) {}

  async create(dto: CreateCategoryDto) { return this._categoryService.create(dto); }
  async findAll() { return this._categoryService.findAll(); }
  async findOne(id: string) { return this._categoryService.findOne(id); }
  async update(id: string, dto: UpdateCategoryDto) { return this._categoryService.update(id, dto); }
  async remove(id: string) { return this._categoryService.remove(id); }
}
