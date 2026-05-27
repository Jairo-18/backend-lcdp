import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '../../shared/entities/product.entity';
import { ProductImage } from '../../shared/entities/product-image.entity';
import { ProductRepository } from '../../shared/repositories/product.repository';
import { ProductPresentationRepository } from '../../shared/repositories/product-presentation.repository';
import { CategoryRepository } from '../../shared/repositories/category.repository';
import { ColorRepository } from '../../shared/repositories/color.repository';
import { CreateProductDto, ProductQueryDto, UpdateProductDto } from '../dtos/product.dto';
import { PageMetaDto } from '../../shared/dtos/pageMeta.dto';
import { ResponsePaginationDto } from '../../shared/dtos/pagination.dto';
import { UploadService } from '../../upload/upload.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly _repo: ProductRepository,
    private readonly _presentationRepo: ProductPresentationRepository,
    private readonly _categoryRepo: CategoryRepository,
    private readonly _colorRepo: ColorRepository,
    private readonly _upload: UploadService,
  ) {}

  async nextCode(): Promise<string> {
    const result = await this._repo
      .createQueryBuilder('product')
      .select('MAX(CAST(product.code AS INTEGER))', 'maxCode')
      .where('product.code ~ :pattern', { pattern: '^[0-9]+$' })
      .getRawOne<{ maxCode: string | null }>();
    return String((result?.maxCode ? Number(result.maxCode) : 0) + 1);
  }

  async create(dto: CreateProductDto): Promise<Product> {
    const { presentations, categoryIds, colorIds, ...productData } = dto;
    productData.code = await this.nextCode();
    const product = this._repo.create(productData);

    product.categories = await this._categoryRepo.findByIds(categoryIds);
    product.colors = colorIds?.length ? await this._colorRepo.findByIds(colorIds) : [];

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
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.colors', 'color')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.taxType', 'taxType')
      .leftJoinAndSelect('product.presentations', 'presentations')
      .leftJoinAndSelect('presentations.unitOfMeasure', 'unitOfMeasure')
      .leftJoinAndSelect('presentations.images', 'images')
      .orderBy(orderCol, orderDir)
      .skip(skip)
      .take(perPage);

    if (query.search) {
      qb.andWhere(
        '(LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.code) LIKE LOWER(:search) OR LOWER(brand.name) LIKE LOWER(:search) OR LOWER(category.name) LIKE LOWER(:search))',
        { search: `%${query.search}%` },
      );
    }

    if (query.categoryId) {
      qb.andWhere('category.id = :categoryId', { categoryId: query.categoryId });
    }

    if (query.brandId) {
      qb.andWhere('product.brandId = :brandId', { brandId: query.brandId });
    }

    if (query.taxTypeId) {
      qb.andWhere('product.taxTypeId = :taxTypeId', { taxTypeId: query.taxTypeId });
    }

    if (query.unitOfMeasureId) {
      qb.andWhere('unitOfMeasure.id = :unitOfMeasureId', { unitOfMeasureId: query.unitOfMeasureId });
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
      .leftJoinAndSelect('product.categories', 'category')
      .leftJoinAndSelect('product.colors', 'color')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.taxType', 'taxType')
      .leftJoinAndSelect('product.presentations', 'presentations')
      .leftJoinAndSelect('presentations.unitOfMeasure', 'unitOfMeasure')
      .leftJoinAndSelect('presentations.images', 'images')
      .where('product.isActive = :isActive', { isActive: true })
      .orderBy('product.isPromotion', 'DESC')
      .addOrderBy(orderCol, orderDir)
      .addOrderBy('presentations.priceSale', 'DESC', 'NULLS LAST')
      .addOrderBy('images.order', 'ASC')
      .skip(skip)
      .take(perPage);

    if (query.search) {
      qb.andWhere(
        '(LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.code) LIKE LOWER(:search) OR LOWER(brand.name) LIKE LOWER(:search) OR LOWER(category.name) LIKE LOWER(:search))',
        { search: `%${query.search}%` },
      );
    }
    if (query.categoryId) {
      qb.andWhere('category.id = :categoryId', { categoryId: query.categoryId });
    }
    if (query.brandId) {
      qb.andWhere('product.brandId = :brandId', { brandId: query.brandId });
    }
    if (query.taxTypeId) {
      qb.andWhere('product.taxTypeId = :taxTypeId', { taxTypeId: query.taxTypeId });
    }
    if (query.unitOfMeasureId) {
      qb.andWhere('unitOfMeasure.id = :unitOfMeasureId', { unitOfMeasureId: query.unitOfMeasureId });
    }
    if (query.colorId) {
      qb.andWhere('color.id = :colorId', { colorId: query.colorId });
    }
    if (query.isPromotion !== undefined) {
      qb.andWhere('product.isPromotion = :isPromotion', { isPromotion: query.isPromotion });
    }

    const [items, itemCount] = await qb.getManyAndCount();
    const pageMeta = new PageMetaDto({ itemCount, pageOptionsDto: query });
    return new ResponsePaginationDto(items, pageMeta);
  }

  async findOne(id: number): Promise<Product> {
    const product = await this._repo.findOne({
      where: { id },
      relations: [
        'categories',
        'colors',
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
    const { presentations, categoryIds, colorIds, ...productData } = dto;

    if ('technicalSheet' in productData && product.technicalSheet && productData.technicalSheet !== product.technicalSheet) {
      this._upload.deleteFile(product.technicalSheet);
    }
    if ('safetySheet' in productData && product.safetySheet && productData.safetySheet !== product.safetySheet) {
      this._upload.deleteFile(product.safetySheet);
    }

    Object.assign(product, productData);
    if (productData.brandId !== undefined) {
      product.brand = { id: productData.brandId } as any;
    }

    if (categoryIds !== undefined) {
      product.categories = await this._categoryRepo.findByIds(categoryIds);
    }

    if (colorIds !== undefined) {
      product.colors = colorIds.length ? await this._colorRepo.findByIds(colorIds) : [];
    }

    if (presentations !== undefined) {
      const oldVariants = product.presentations.flatMap(p => p.images.map(img => img.variants));
      const newThumbs = new Set(presentations.flatMap(p => (p.images ?? []).map(v => v.thumb)));
      const removedVariants = oldVariants.filter(v => !newThumbs.has(v.thumb));
      await this._presentationRepo.delete({ productId: id });
      removedVariants.forEach(v => this._upload.deleteVariants(v));
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
    const oldVariants = product.presentations.flatMap(p => p.images.map(img => img.variants));
    await this._repo.remove(product);
    oldVariants.forEach(v => this._upload.deleteVariants(v));
    if (product.technicalSheet) this._upload.deleteFile(product.technicalSheet);
    if (product.safetySheet) this._upload.deleteFile(product.safetySheet);
  }
}
