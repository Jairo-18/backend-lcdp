import { Injectable } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto, ProductQueryDto, UpdateProductDto } from '../dtos/product.dto';

@Injectable()
export class ProductUC {
  constructor(private readonly _productService: ProductService) {}

  async create(dto: CreateProductDto) { return this._productService.create(dto); }
  async findAll(query: ProductQueryDto) { return this._productService.findAll(query); }
  async findOne(id: string) { return this._productService.findOne(id); }
  async update(id: string, dto: UpdateProductDto) { return this._productService.update(id, dto); }
  async remove(id: string) { return this._productService.remove(id); }
}
