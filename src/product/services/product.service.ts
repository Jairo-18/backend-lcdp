import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../../shared/entities/product.entity';
import { ProductRepository } from '../../shared/repositories/product.repository';
import { ProductPresentationRepository } from '../../shared/repositories/product-presentation.repository';
import { CreateProductDto, UpdateProductDto } from '../dtos/product.dto';

@Injectable()
export class ProductService {
  constructor(
    private readonly _repo: ProductRepository,
    private readonly _presentationRepo: ProductPresentationRepository,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const { presentations, ...productData } = dto;
    const product = this._repo.create(productData);

    if (presentations?.length) {
      product.presentations = presentations.map((p) =>
        this._presentationRepo.create(p),
      );
    }

    return this._repo.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this._repo.find({
      relations: ['category', 'brand', 'presentations', 'presentations.unitOfMeasure'],
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this._repo.findOne({
      where: { id },
      relations: [
        'category',
        'brand',
        'presentations',
        'presentations.unitOfMeasure',
        'presentations.images',
      ],
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const { presentations, ...productData } = dto;
    Object.assign(product, productData);

    if (presentations !== undefined) {
      await this._presentationRepo.delete({ productId: id });
      product.presentations = presentations.map((p) =>
        this._presentationRepo.create({ ...p, productId: id }),
      );
    }

    return this._repo.save(product);
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    await this._repo.remove(product);
  }
}
