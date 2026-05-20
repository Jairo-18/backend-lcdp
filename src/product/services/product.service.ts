import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../../shared/entities/product.entity';
import { ProductImage } from '../../shared/entities/product-image.entity';
import { ProductRepository } from '../../shared/repositories/product.repository';
import { ProductPresentationRepository } from '../../shared/repositories/product-presentation.repository';
import { CreateProductDto, ProductQueryDto, UpdateProductDto } from '../dtos/product.dto';
import { PageMetaDto } from '../../shared/dtos/pageMeta.dto';
import { ResponsePaginationDto } from '../../shared/dtos/pagination.dto';

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
      product.presentations = presentations.map((p) => {
        const { images, ...presData } = p;
        const pres = this._presentationRepo.create(presData);
        if (images?.length) {
          pres.images = images.map((variants, order) =>
            Object.assign(new ProductImage(), { variants, order }),
          );
        }
        return pres;
      });
    }

    return this._repo.save(product);
  }

  async findAll(query: ProductQueryDto): Promise<ResponsePaginationDto<Product>> {
    const page    = query.page    ?? 1;
    const perPage = query.perPage ?? 10;
    const skip    = (page - 1) * perPage;

    const orderCol = query.orderBy === 'createdAt' ? 'product.createdAt' : 'product.name';
    const orderDir = query.order ?? 'ASC';

    const qb = this._repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.taxType', 'taxType')
      .leftJoinAndSelect('product.presentations', 'presentations')
      .leftJoinAndSelect('presentations.unitOfMeasure', 'unitOfMeasure')
      .leftJoinAndSelect('presentations.images', 'images')
      .orderBy(orderCol, orderDir)
      .skip(skip)
      .take(perPage);

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

    const [items, itemCount] = await qb.getManyAndCount();
    const pageMeta = new PageMetaDto({ itemCount, pageOptionsDto: query });
    return new ResponsePaginationDto(items, pageMeta);
  }

  async findAllPublic(query: ProductQueryDto): Promise<ResponsePaginationDto<Product>> {
    const page    = query.page    ?? 1;
    const perPage = query.perPage ?? 25;
    const skip    = (page - 1) * perPage;

    const orderCol = query.orderBy === 'createdAt' ? 'product.createdAt' : 'product.name';
    const orderDir = query.order ?? 'ASC';

    const qb = this._repo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.taxType', 'taxType')
      .leftJoinAndSelect('product.presentations', 'presentations')
      .leftJoinAndSelect('presentations.unitOfMeasure', 'unitOfMeasure')
      .leftJoinAndSelect('presentations.images', 'images')
      .where('product.isActive = :isActive', { isActive: true })
      .orderBy(orderCol, orderDir)
      .skip(skip)
      .take(perPage);

    if (query.search) {
      qb.andWhere('LOWER(product.name) LIKE LOWER(:search)', { search: `%${query.search}%` });
    }
    if (query.categoryId) {
      qb.andWhere('product.categoryId = :categoryId', { categoryId: query.categoryId });
    }
    if (query.brandId) {
      qb.andWhere('product.brandId = :brandId', { brandId: query.brandId });
    }

    const [items, itemCount] = await qb.getManyAndCount();
    const pageMeta = new PageMetaDto({ itemCount, pageOptionsDto: query });
    return new ResponsePaginationDto(items, pageMeta);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this._repo.findOne({
      where: { id },
      relations: [
        'category',
        'brand',
        'taxType',
        'presentations',
        'presentations.unitOfMeasure',
        'presentations.images',
      ],
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    const { presentations, ...productData } = dto;
    Object.assign(product, productData);

    if (presentations !== undefined) {
      await this._presentationRepo.delete({ productId: id });
      product.presentations = presentations.map((p) => {
        const { images, ...presData } = p;
        const pres = this._presentationRepo.create({ ...presData, productId: id });
        if (images?.length) {
          pres.images = images.map((variants, order) =>
            Object.assign(new ProductImage(), { variants, order }),
          );
        }
        return pres;
      });
    }

    return this._repo.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this._repo.remove(product);
  }
}
