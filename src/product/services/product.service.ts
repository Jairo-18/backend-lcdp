import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../../shared/entities/product.entity';
import { ProductRepository } from '../../shared/repositories/product.repository';
import { ProductPresentationRepository } from '../../shared/repositories/product-presentation.repository';
import { CreateProductDto, ProductQueryDto, UpdateProductDto } from '../dtos/product.dto';
import { PaginatedResult } from '../../shared/dtos/pagination.dto';

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

  async findAll(query: ProductQueryDto): Promise<PaginatedResult<Product>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const orderCol = query.orderBy === 'createdAt' ? 'product.createdAt' : 'product.name';
    const orderDir = query.order ?? 'ASC';

    const qb = this._repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.presentations', 'presentations')
      .leftJoinAndSelect('presentations.unitOfMeasure', 'unitOfMeasure')
      .leftJoinAndSelect('presentations.images', 'images')
      .orderBy(orderCol, orderDir)
      .skip(skip)
      .take(limit);

    if (query.search) {
      qb.andWhere('LOWER(product.name) LIKE LOWER(:search)', {
        search: `%${query.search}%`,
      });
    }

    if (query.categoryId) {
      qb.andWhere('product.categoryId = :categoryId', { categoryId: query.categoryId });
    }

    if (query.brandId) {
      qb.andWhere('product.brandId = :brandId', { brandId: query.brandId });
    }

    const [items, total] = await qb.getManyAndCount();

    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
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
