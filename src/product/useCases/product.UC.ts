import { Injectable } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { CreateProductDto, ProductQueryDto, UpdateProductDto } from '../dtos/product.dto';

@Injectable()
export class ProductUC {
  constructor(private readonly _productService: ProductService) {}

  async nextCode() { return this._productService.nextCode(); }
  async create(dto: CreateProductDto) { return this._productService.create(dto); }
  async findAll(query: ProductQueryDto) { return this._productService.findAll(query); }
  async findAllPublic(query: ProductQueryDto) { return this._productService.findAllPublic(query); }
  async findCalculadora() { return this._productService.findCalculadora(); }
  async findOne(id: number) { return this._productService.findOne(id); }
  async update(id: number, dto: UpdateProductDto) { return this._productService.update(id, dto); }
  async remove(id: number) { return this._productService.remove(id); }
}
